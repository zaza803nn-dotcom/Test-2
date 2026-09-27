# 🔧 سجل التعديلات (Changelog) — FreshCart

> الملف ده فيه **كل** التغييرات اللي اتعملت على المشروع: اللي اتصلح، اللي اتشال، واللي اتضاف — تفصيليًا ملف بملف.
> كل التعديلات موثقة كمان جوه الكود نفسه بكومنتات شكل `// FIX: ...`.

**حالة المشروع بعد التعديلات:**

- ✅ `npm run lint` → 0 errors
- ✅ `npm run build` → بينجح (تحذير حجم chunk واحد بس — ملاحظة خارج النطاق)

---

## 📑 فهرس

1. [أخطاء كاسرة اتصلحت](#-1-أخطاء-كاسرة-اتصلحت)
2. [ملفات جديدة اتعملت](#-2-ملفات-جديدة-اتعملت)
3. [ملفات اتمسحت خالص](#-3-ملفات-اتمسحت-خالص)
4. [ملفات اتعدلت](#-4-ملفات-اتعدلت)
5. [اللي لسه محتاج شغل (مش من نطاق التعديلات)](#-5-اللي-لسه-محتاج-شغل)

---

## 🔴 1) أخطاء كاسرة اتصلحت

### 1.1 — صفحة `/Wishlist` كانت مش صفحة أصلًا (أخطر غلطة)

- **اللي كان:** `src/pages/Wishlist/Wishlist.jsx` كان بيصدّر "زرار القلب" (heart button) كـ default export، والـ route بتاع `/Wishlist` في `App.jsx` كان بيستورده وهو فاكره صفحة. يعني لما المستخدم يفتح `/Wishlist` كان هيشوف **زرار واحد بس** في نص الصفحة.
- **الحل:** زرار القلب اتنقل لملف جديد `WishlistHeartButton.jsx`، وملف `Wishlist.jsx` بقى **صفحة حقيقية** فيها: عرض منتجات الـ wishlist (صورة، اسم، سعر، كاتيجوري) + زرار حذف + زرار إضافة للسلة + empty state + loading + error.

### 1.2 — تعارض الـ queryKey بتاع السلة (أكبر مشكلة معمارية)

- **اللي كان:** 3 كاشين مختلفين لنفس السلة:
  - `Navbar.jsx`: `["cart", token]`
  - `CartPage.jsx`: `["cart"]`
  - `Cart.jsx` (زرار الإضافة): بيكتب على `["cart"]`

  النتيجة: لما تضيف منتج للسلة، عدّاد الـ Navbar ما كانش بيتحدث من الكاش — وكاش الـ Navbar كان `staleTime: 5 دقايق` من غير invalidation.

- **الحل:** المفتاح اتوحّد على `["cart"]` في **كل** الملفات، والتحديث بعد كل mutation بقى `queryClient.invalidateQueries({ queryKey: ["cart"] })`.

### 1.3 — `toast.error` لعملية ناجحة

- **اللي كان:** في `WishlistSlide.jsx`، عند حذف منتج من الـ wishlist **بنجاح** كان بيطلع `toast.error("Removed from Wishlist")`.
- **الحل:** بقى `toast.success("Removed from Wishlist")`.

### 1.4 — زرار "Proceed To Checkout" كان ميّت

- **اللي كان:** في `CartPage.jsx` الزرار مفيش فيه `onClick` ولا `navigate` — بيدوس عليه ومفيش حاجة بتحصل.
- **الحل:** ضفنا `useNavigate` + `onClick={() => navigate("/Checkout")}`.

---

## 🟢 2) ملفات جديدة اتعملت

### `src/api/api.js` _(جديد)_

- **السبب:** `getToken()` + `BASE_URL` + `headers: { token }` كانوا مكررين يدويًا في كل ملف (`Wishlist.jsx`, `CartPage.jsx`, `Cart.jsx`, `Navbar.jsx`, `WishlistSlide.jsx`...).
- **اللي فيه:**
  - `BASE_URL` ثابت مرة واحدة.
  - axios instance واحد للمشروع كله (`baseURL` مظبوط).
  - **request interceptor** بيقرأ الـ token من `localStorage` ويحطه في الـ header تلقائيًا على كل request — فمفيش نسيان header تاني أبدًا.

### `src/pages/Wishlist/WishlistHeartButton.jsx` _(جديد)_

- **اللي فيه:** زرار القلب القديم (نفس الـ UI والـ animations بالظبط — ripple + particles + scale) بس:
  - اسم المكون بقى واضح: `WishlistHeartButton` بدل `Wishlist` (الاسم ده بقى للصفحة).
  - بيستخدم الـ api instance بدل axios المكرر.
  - شيلنا `refetch` الـ unused من الـ destructuring.

### `src/Redux/` _(فولدر جديد — بديل `src/Rudex/`)_

| ملف                                | اللي فيه                                                                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/Redux/store.js`               | الـ store الموحد. الـ keys بقت `cart` و `authentication` (بدل `Cart` و `Authentication`) — كان الوصول ساعتها `state.Cart.Cart` (تكرار أسماء مربك)                                                            |
| `src/Redux/CartSlice.js`           | العدّاد بقى `state.cart.count`. الـ reducers الميتة `addtoCart` و `RemoveFromCart` اتشالت (كانوا بيغيروا العدّاد محليًا من غير أي API call)                                                                  |
| `src/Redux/AuthenticationSlice.js` | الـ reducers بقت **pure** (مفيش localStorage جواهم). التخزين بقى عن طريق helpers: `saveAuthToStorage()` و `clearAuthFromStorage()`. كمان شيلنا `isAuthenticated` (كان مكرر — وجود الـ token نفسه هو الدلالة) |

---

## 🗑️ 3) ملفات اتمسحت خالص

| ملف                          | السبب                                                                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/Rudex/` (الفولدر كله)   | الاسم كان مكتوب غلط (Rudex ← Redux). محتواه اتكتب من جديد صح في `src/Redux/`                                                                                           |
| `src/Rudex/WishlistSlice.js` | **Dead code بالكامل**: الـ state `Wishlist: []` والـ reducer `ToggleWishlist` مش مستخدمين في أي ملف في المشروع — كل حاجة شغالة بـ React Query على مفتاح `["wishlist"]` |

---

## ✏️ 4) ملفات اتعدلت

### `src/App.jsx`

- ❌ **اتشال:** `const queryClient = new QueryClient()` و `const Routes = createBrowserRouter([...])` من **جوه** `App()` — كانوا بيتعملوا من جديد مع كل render (anti-pattern في react-query و router-dom).
- ➕ **اتضاف:** الاتنين اتنقلوا خارج المكون (مرة واحدة لكل عمر الـ app).
- ✏️ **اتغير:** استيراد الـ store من `"./Rudex/Rudex"` → `"./Redux/store"`.
- ✏️ **اتغير:** import الـ Wishlist بقى عمداً الصفحة الحقيقية (مع كومنت يوضح الغلطة القديمة).

### `src/Components/Navbar/Navbar.jsx`

- ❌ **اتشال:** `queryKey: ["cart", token]` (كاش منفصل) → بقى `["cart"]` موحد.
- ❌ **اتشال:** `data: CartData` و `isLoading: isCartLoading` من الـ destructuring (كانوا unused — العدّاد بيتقرأ من Redux)، لكن الـ query نفسها لازمة عشان تعبّي الكاش.
- ❌ **اتشال:** `import axios` (بقى unused بعد الـ instance).
- ✏️ **اتغير:** `state.Authentication.token` → `state.authentication.token`، و `state.Cart.Cart` → `state.cart.count`.
- ✏️ **اتغير:** `GetLoggedUserCart(token)` — البراميتر `token` اتشال (بقى unused بعد الـ interceptor).
- ✏️ **اتغير:** `handleLogout` بقى يمسح الـ localStorage **أول** (`clearAuthFromStorage()`) وبعدين `dispatch(logout())` — بدل ما الـ reducer يعمل المسح جواه (side effect غلط).
- ✏️ **اتغير:** axios بعنوان كامل + headers يدوي → `api.get('/cart')` من الـ instance.

### `src/pages/Cart/Cart.jsx` (زرار الإضافة)

- ❌ **اتشال:** من `onSuccess`: الـ `try/catch` والـ `axios.get` اليدوي لإعادة جيب السلة + `queryClient.setQueryData` (كان بيكتب على مفتاح الـ Navbar مش هيوصل).
- ➕ **اتضاف:** `dispatch(setCart(data.numOfCartItems))` من نفس الـ response + `invalidateQueries(["cart"])`.
- ✏️ **اتغير:** import من `"../../Rudex/CartSlice"` → `"../../Redux/CartSlice"`.
- ✏️ **اتغير:** axios بعنوان كامل → `api.post('/cart')`.

### `src/pages/Cart/CartPage.jsx`

- ❌ **اتشال:** `staleTime: Infinity` — كانت معناها الـ data عمرها ما تعتبر قديمة حتى بعد تغيير السلة.
- ➕ **اتضاف:** `staleTime: 30 ثانية` + invalidation بعد كل mutation.
- ➕ **اتضاف:** `useNavigate` + onClick على زرار Proceed To Checkout.
- ✏️ **اتغير:** `const Products = CartData?.data?.products || []` → `useMemo` (كان بيعمل array جديد كل render وبيبوظ dependencies بتاع الـ summary useMemo).
- ✏️ **اتغير:** الفور functions (Get / Update / Remove / Clear) كلها بقى `api.get/put/delete` بدل axios + getToken + headers يدوي.

### `src/pages/Wishlist/WishlistSlide.jsx`

- ❌ **اتشال:** `const BASE_URL` و `function getToken()` (كانوا مكررين) + `import axios`.
- ✏️ **اتغير:** `toast.error("Removed from Wishlist")` → `toast.success(...)`.
- ✏️ **اتغير:** `enabled: !!getToken() && open` → `enabled: !!localStorage.getItem("token") && open`.
- ❌ **اتشال:** `ShoppingBag` من import lucide-react (unused).
- ✏️ **اتغير:** الفور functions (Get / Remove) → api instance.

### `src/pages/Auth/Login.jsx`

- ❌ **اتشال:** `console.log("Login Data:", data)`.
- ❌ **اتشال:** التكرار — `localStorage.setItem("token")` + `setItem("user")` اليدوي كان بيتكرر بعد كده جوه الـ `setCredentials` reducer.
- ➕ **اتضاف:** كتابة واحدة في localStorage عن طريق `saveAuthToStorage()` ثم `dispatch(setCredentials(...))` صرف.
- ✏️ **اتغير:** import من `"../../Rudex/AuthenticationSlice"` → `"../../Redux/AuthenticationSlice"`.

### `src/pages/Home/Home.jsx`

- ❌ **اتشال:** زرارين تجريبيين "add to cart" و "Remove From Cart" — كانوا بينادوا `addtoCart`/`RemoveFromCart` اللي كانوا بيغيروا العدّاد **من غير أي API**، فالعدّاد في الـ Navbar كان بيطلع مختلف عن السلة الحقيقية.
- ❌ **اتشال:** `console.log(state)` اللي كان بيطبع الـ store كله مع كل render + `useSelector` و `useDispatch` بدون استخدام.
- ❌ **اتشال:** import من الفولدر الغلط `"../../Rudex/CartSlice"`.

### `src/Components/ProtectedRoute/ProtectedRoute.jsx`

- ❌ **اتشال:** `useEffect` + `toast` + `setTimeout(navigate, 1200)` — كان بيخلي الصفحة المحمية معلقة ثانية كاملة قبل التحويل.
- ➕ **اتضاف:** تحويل فوري بـ `<Navigate to="/Login" replace />` (الطريقة الموصى بيها في react-router).
- ✏️ **اتغير:** `useNavigate` → `Navigate` (مفيش useEffect تاني).

### 12 ملف إضافي (تنظيف lint فقط)

فيهم `import React` unused — اتشال من:
`TextLoop.jsx`, `Addresses.jsx`, `BrandDetails.jsx`, `Brands.jsx`, `CategoryDetails.jsx`, `Checkout.jsx`, `PaymentSuccess.jsx`, `OrderDetails.jsx`, `Orders.jsx`, `ChangePassword.jsx`, `Profile.jsx`, `UpdateProfile.jsx`
(Vite + الـ jsx runtime الجديد مش محتاجين استيراد React).

### `src/pages/Products/Products.jsx` + `src/pages/Products/ProductDetails.jsx`

- ✏️ **اتغير فقط:** استيراد زرار القلب من `"../Wishlist/Wishlist"` (الملف ده كان الزرار + هيبقى الصفحة) → `"../Wishlist/WishlistHeartButton"`.

---

## 📌 5) اللي لسه محتاج شغل (مش من نطاق التعديلات)

- **`src/pages/Checkout/Checkout.jsx`** — لسه placeholder (`<div>Checkout</div>`) — زرار الـ Proceed دلوقتي بيوديك عليه، لكن الصفحة نفسها محتاجة تتكتب (أوردر + الدفع كاش/أونلاين).
- **`src/pages/Checkout/PaymentSuccess.jsx`** — placeholder كذلك.
- **`src/pages/Orders/`, `Profile/`, `Addresses/`** — placeholders (مفيش API calls لسه).
- **تحذير حجم الـ bundle** — الـ JS chunk ~989KB؛ ينفع code-splitting بالـ `dynamic import()` أو `React.lazy` للصفحات (لو حابب أعملها قولي).
