// // src/pages/AddProductPage.jsx
// import React, { useMemo, useState } from "react";
// import {
//   Package,
//   Tag,
//   IndianRupee,
//   Utensils,
//   Image as ImageIcon,
//   Store,
//   Shield,
//   Plus,
//   X,
//   Loader2,
//   CheckCircle2,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// const DUMMY_BRANDS = [
//   { id: 1, name: "Thanco's Natural Ice Cream", code: "THANCOS" },
//   { id: 2, name: "Wow Belgian", code: "WOWBEL" },
// ];

// const DUMMY_CATEGORIES = [
//   { id: 1, name: "Ice Cream" },
//   { id: 2, name: "Sundaes" },
//   { id: 3, name: "Milkshakes" },
//   { id: 4, name: "Others" },
// ];

// export default function AddProductPage() {
//   const { role, user } = useAuth();

//   const isSuperAdmin = role === "super_admin";
//   const canEdit = isSuperAdmin; // only super_admin can actually add product

//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     brand_id: isSuperAdmin ? DUMMY_BRANDS[0].id : null,
//     name: "",
//     sku: "",
//     category_id: DUMMY_CATEGORIES[0].id,
//     veg_type: "veg", // veg | non_veg | egg
//     base_price: "",
//     tax_rate: "0",
//     description: "",
//     is_active: true,
//   });

//   const [variants, setVariants] = useState([
//     { id: 1, name: "Regular", price_delta: "0", is_default: true },
//   ]);

//   const [imagePreview, setImagePreview] = useState(null);

//   const selectedBrand = useMemo(() => {
//     if (isSuperAdmin) {
//       return DUMMY_BRANDS.find((b) => b.id === form.brand_id) || null;
//     }
//     if (user?.brand_name) {
//       return { id: user.brand_id || 0, name: user.brand_name, code: user.brand_code || "" };
//     }
//     return null;
//   }, [isSuperAdmin, form.brand_id, user]);

//   function updateFormField(key, value) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setSaved(false);
//     setError("");
//   }

//   function handleVegTypeChange(value) {
//     updateFormField("veg_type", value);
//   }

//   function handleVariantChange(idx, key, value) {
//     setVariants((prev) => {
//       const copy = [...prev];
//       copy[idx] = { ...copy[idx], [key]: value };
//       if (key === "is_default" && value) {
//         // only one default
//         return copy.map((v, i) => ({ ...v, is_default: i === idx }));
//       }
//       return copy;
//     });
//     setSaved(false);
//   }

//   function addVariant() {
//     setVariants((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         name: "",
//         price_delta: "0",
//         is_default: false,
//       },
//     ]);
//     setSaved(false);
//   }

//   function removeVariant(id) {
//     setVariants((prev) => prev.filter((v) => v.id !== id));
//     setSaved(false);
//   }

//   function handleImageChange(e) {
//     const file = e.target.files && e.target.files[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setImagePreview(url);
//     setSaved(false);
//   }

//   async function handleSubmit(e) {
//     e?.preventDefault();
//     if (!canEdit) return;

//     setSaving(true);
//     setSaved(false);
//     setError("");

//     try {
//       // very basic validation
//       if (!form.name.trim()) throw new Error("Product name is required.");
//       if (!form.base_price || isNaN(Number(form.base_price))) {
//         throw new Error("Valid base price is required.");
//       }

//       // simulate API call
//       await new Promise((res) => setTimeout(res, 800));

//       // here you would POST to /products with form + variants

//       setSaved(true);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to save product.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!canEdit) {
//     // Non-super admin view
//     return (
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
//           <Package size={22} />
//           Add Product
//         </h1>
//         <p className="text-sm text-slate-500 mb-4">
//           You do not have permission to add products. This action is restricted
//           to the Super Admin.
//         </p>

//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex gap-3">
//           <Shield size={18} className="mt-0.5" />
//           <div>
//             <p className="font-semibold mb-1">Restricted Access</p>
//             <p>
//               Please contact your Super Admin if you need a new product, flavour
//               or item to be added to the menu.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Only Super Admin gets full Add Product form
//   return (
//     <div className="max-w-6xl mx-auto flex flex-col gap-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
//           <Package size={22} />
//           Add Product
//         </h1>
//         <p className="text-sm text-slate-500 mt-1">
//           Create a new product for table ordering. You can define base details,
//           pricing and variants.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Brand + Category */}
//         <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//           <div className="flex items-center justify-between gap-2">
//             <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//               <Store size={16} />
//               Brand & Category
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Brand */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Brand
//               </label>
//               {isSuperAdmin ? (
//                 <select
//                   value={form.brand_id}
//                   onChange={(e) =>
//                     updateFormField("brand_id", Number(e.target.value))
//                   }
//                   className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//                 >
//                   {DUMMY_BRANDS.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <div className="px-3 py-2 rounded-md border border-slate-100 bg-slate-50 text-sm text-slate-700 flex items-center gap-2">
//                   <Store size={14} className="text-slate-400" />
//                   <span>{selectedBrand?.name || "Brand"}</span>
//                 </div>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Category
//               </label>
//               <select
//                 value={form.category_id}
//                 onChange={(e) =>
//                   updateFormField("category_id", Number(e.target.value))
//                 }
//                 className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//               >
//                 {DUMMY_CATEGORIES.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* Basic Info */}
//         <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//           <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//             <Tag size={16} />
//             Basic Details
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Name */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 value={form.name}
//                 onChange={(e) => updateFormField("name", e.target.value)}
//                 placeholder="e.g. Belgian Chocolate Scoop"
//                 className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//                 required
//               />
//             </div>

//             {/* SKU / Code */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 SKU / Code
//               </label>
//               <input
//                 type="text"
//                 value={form.sku}
//                 onChange={(e) => updateFormField("sku", e.target.value)}
//                 placeholder="e.g. ICE-BEL-01"
//                 className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//               />
//             </div>
//           </div>

//           {/* Veg Type + Active */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Type
//               </label>
//               <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 overflow-hidden text-xs">
//                 <button
//                   type="button"
//                   onClick={() => handleVegTypeChange("veg")}
//                   className={
//                     "px-3 py-1.5 flex items-center gap-1 " +
//                     (form.veg_type === "veg"
//                       ? "bg-emerald-100 text-emerald-700"
//                       : "text-slate-600")
//                   }
//                 >
//                   <Utensils size={12} />
//                   Veg
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleVegTypeChange("non_veg")}
//                   className={
//                     "px-3 py-1.5 flex items-center gap-1 " +
//                     (form.veg_type === "non_veg"
//                       ? "bg-red-100 text-red-700"
//                       : "text-slate-600")
//                   }
//                 >
//                   <Utensils size={12} />
//                   Non-Veg
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleVegTypeChange("egg")}
//                   className={
//                     "px-3 py-1.5 flex items-center gap-1 " +
//                     (form.veg_type === "egg"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "text-slate-600")
//                   }
//                 >
//                   <Utensils size={12} />
//                   Egg
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 mt-1">
//               <input
//                 id="is_active"
//                 type="checkbox"
//                 checked={form.is_active}
//                 onChange={(e) => updateFormField("is_active", e.target.checked)}
//                 className="h-4 w-4 text-slate-900 border-slate-300 rounded"
//               />
//               <label
//                 htmlFor="is_active"
//                 className="text-xs font-medium text-slate-700"
//               >
//                 Active on menu
//               </label>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">
//               Description
//             </label>
//             <textarea
//               rows={3}
//               value={form.description}
//               onChange={(e) => updateFormField("description", e.target.value)}
//               placeholder="Short description visible to customers / staff..."
//               className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 resize-none"
//             />
//           </div>
//         </section>

//         {/* Pricing */}
//         <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//           <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//             <IndianRupee size={16} />
//             Pricing
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Base price */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Base Price (₹) *
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={form.base_price}
//                 onChange={(e) => updateFormField("base_price", e.target.value)}
//                 placeholder="e.g. 120"
//                 className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//                 required
//               />
//             </div>

//             {/* Tax Rate */}
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Tax Rate (%)
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.1"
//                 value={form.tax_rate}
//                 onChange={(e) => updateFormField("tax_rate", e.target.value)}
//                 placeholder="e.g. 18"
//                 className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Variants */}
//         <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//           <div className="flex items-center justify-between gap-2">
//             <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//               <Package size={16} />
//               Variants (Optional)
//             </h2>
//             <button
//               type="button"
//               onClick={addVariant}
//               className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
//             >
//               <Plus size={12} />
//               Add Variant
//             </button>
//           </div>

//           {variants.length === 0 ? (
//             <p className="text-xs text-slate-500">
//               No variants added. Base product price will be used.
//             </p>
//           ) : (
//             <div className="space-y-3">
//               {variants.map((variant, idx) => (
//                 <div
//                   key={variant.id}
//                   className="grid grid-cols-1 sm:grid-cols-[1.5fr,1fr,auto] gap-2 items-center border border-slate-100 rounded-lg px-3 py-2 bg-slate-50"
//                 >
//                   {/* Variant name */}
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
//                       Variant Name
//                     </label>
//                     <input
//                       type="text"
//                       value={variant.name}
//                       onChange={(e) =>
//                         handleVariantChange(idx, "name", e.target.value)
//                       }
//                       placeholder="e.g. Single Scoop / Double Scoop"
//                       className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900/10"
//                     />
//                   </div>

//                   {/* Price delta */}
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
//                       Price Change (₹)
//                     </label>
//                     <input
//                       type="number"
//                       value={variant.price_delta}
//                       onChange={(e) =>
//                         handleVariantChange(idx, "price_delta", e.target.value)
//                       }
//                       placeholder="e.g. 0, 30, -10"
//                       className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900/10"
//                     />
//                   </div>

//                   {/* Default + remove */}
//                   <div className="flex items-center justify-end gap-2 mt-2 sm:mt-5">
//                     <label className="inline-flex items-center gap-1 text-[11px] text-slate-600">
//                       <input
//                         type="checkbox"
//                         checked={variant.is_default}
//                         onChange={(e) =>
//                           handleVariantChange(
//                             idx,
//                             "is_default",
//                             e.target.checked
//                           )
//                         }
//                         className="h-3.5 w-3.5 rounded border-slate-300"
//                       />
//                       Default
//                     </label>
//                     {variants.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeVariant(variant.id)}
//                         className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
//                         aria-label="Remove variant"
//                       >
//                         <X size={12} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Image */}
//         <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
//           <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//             <ImageIcon size={16} />
//             Product Image (Optional)
//           </h2>
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//             <div className="h-20 w-20 rounded-lg border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <ImageIcon size={20} className="text-slate-400" />
//               )}
//             </div>
//             <div>
//               <label className="text-xs text-slate-700 mb-1 block">
//                 Upload thumbnail image
//               </label>
//               <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
//                 <ImageIcon size={14} />
//                 Choose file
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageChange}
//                 />
//               </label>
//               <p className="text-[11px] text-slate-400 mt-1">
//                 Recommended: square PNG/JPG, at least 600x600px.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Footer actions */}
//         <div className="flex items-center justify-between gap-3">
//           <div className="text-xs text-slate-500">
//             {error && (
//               <div className="text-red-600 mb-1">
//                 {error}
//               </div>
//             )}
//             {saved && !error && (
//               <div className="inline-flex items-center gap-1 text-emerald-600">
//                 <CheckCircle2 size={12} />
//                 Product saved successfully (dummy).
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="text-xs sm:text-sm px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 size={14} className="animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Package size={14} />
//                   Save Product
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }






// src/pages/AddProductPage.jsx
import React, { useMemo, useState } from "react";
import {
  Package,
  Tag,
  IndianRupee,
  Utensils,
  Image as ImageIcon,
  Store,
  Shield,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Flame,
  Timer,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DUMMY_BRANDS = [
  { id: 1, name: "Thanco's Natural Ice Cream", code: "THANCOS" },
  { id: 2, name: "Wow Belgian", code: "WOWBEL" },
];

const DUMMY_CATEGORIES = [
  { id: 1, name: "Starter" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Dessert" },
  { id: 4, name: "Beverage" },
  { id: 5, name: "Sides" },
  { id: 6, name: "Combo" },
  { id: 7, name: "Others" },
];

const DUMMY_CUISINES = [
  "Not Specific / Global",
  "Indian",
  "Chinese",
  "Italian",
  "Continental",
  "Mexican",
  "American",
  "Mediterranean",
];

const FOOD_TYPES = [
  { key: "food", label: "Food Item" },
  { key: "beverage", label: "Beverage" },
  { key: "addon", label: "Add-on / Extra" },
  { key: "combo", label: "Combo / Platter" },
];

const SPICE_LEVELS = [
  { key: "none", label: "Not Spicy" },
  { key: "mild", label: "Mild" },
  { key: "medium", label: "Medium" },
  { key: "hot", label: "Hot" },
  { key: "extra_hot", label: "Extra Hot" },
];

export default function AddProductPage() {
  const { role, user } = useAuth();

  const isSuperAdmin = role === "super_admin";
  const canEdit = isSuperAdmin; // only super admin can add products

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    brand_id: isSuperAdmin ? DUMMY_BRANDS[0].id : null,
    name: "",
    sku: "",
    category_id: DUMMY_CATEGORIES[0].id,
    veg_type: "veg", // veg | non_veg | egg
    food_type: "food", // food | beverage | addon | combo
    course: "Main Course",
    cuisine: "Not Specific / Global",
    spice_level: "none",
    base_price: "",
    tax_rate: "0",
    prep_time_mins: "",
    tags: "",
    description: "",
    allergens: "",
    is_recommended: false,
    is_customizable: false,
    is_active: true,
  });

  const [variants, setVariants] = useState([
    { id: 1, name: "Regular", price_delta: "0", is_default: true },
  ]);

  const [imagePreview, setImagePreview] = useState(null);

  const selectedBrand = useMemo(() => {
    if (isSuperAdmin) {
      return DUMMY_BRANDS.find((b) => b.id === form.brand_id) || null;
    }
    if (user?.brand_name) {
      return {
        id: user.brand_id || 0,
        name: user.brand_name,
        code: user.brand_code || "",
      };
    }
    return null;
  }, [isSuperAdmin, form.brand_id, user]);

  function updateFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError("");
  }

  function handleVegTypeChange(value) {
    updateFormField("veg_type", value);
  }

  function handleFoodTypeChange(value) {
    updateFormField("food_type", value);
  }

  function handleSpiceLevelChange(value) {
    updateFormField("spice_level", value);
  }

  function handleVariantChange(idx, key, value) {
    setVariants((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      if (key === "is_default" && value) {
        return copy.map((v, i) => ({ ...v, is_default: i === idx }));
      }
      return copy;
    });
    setSaved(false);
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        price_delta: "0",
        is_default: false,
      },
    ]);
    setSaved(false);
  }

  function removeVariant(id) {
    setVariants((prev) => prev.filter((v) => v.id !== id));
    setSaved(false);
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setSaved(false);
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!canEdit) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      if (!form.name.trim()) throw new Error("Product name is required.");
      if (!form.base_price || isNaN(Number(form.base_price))) {
        throw new Error("Valid base price is required.");
      }

      // simulate API call
      await new Promise((res) => setTimeout(res, 800));

      // here you would POST to /products with:
      // { ...form, variants, image: ... }

      setSaved(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  if (!canEdit) {
    // Non-super admin view
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
          <Package size={22} />
          Add Product
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          You do not have permission to add products. This action is restricted
          to the Super Admin.
        </p>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex gap-3">
          <Shield size={18} className="mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Restricted Access</p>
            <p>
              Please contact your Super Admin if you need a new food item,
              beverage, combo or add-on to be added to the menu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Super Admin full form
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Package size={22} />
          Add Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new item for the menu. Supports all types of food products:
          food, beverages, combos and add-ons.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand + Category */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Store size={16} />
              Brand & Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Brand
              </label>
              {isSuperAdmin ? (
                <select
                  value={form.brand_id}
                  onChange={(e) =>
                    updateFormField("brand_id", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                >
                  {DUMMY_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 rounded-md border border-slate-100 bg-slate-50 text-sm text-slate-700 flex items-center gap-2">
                  <Store size={14} className="text-slate-400" />
                  <span>{selectedBrand?.name || "Brand"}</span>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  updateFormField("category_id", Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              >
                {DUMMY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Food Type / Course / Cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Food Type */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Product Type
              </label>
              <select
                value={form.food_type}
                onChange={(e) => handleFoodTypeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              >
                {FOOD_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Course
              </label>
              <select
                value={form.course}
                onChange={(e) => updateFormField("course", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              >
                <option>Starter</option>
                <option>Main Course</option>
                <option>Dessert</option>
                <option>Snack</option>
                <option>Side</option>
                <option>Combo</option>
                <option>Others</option>
              </select>
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Cuisine
              </label>
              <select
                value={form.cuisine}
                onChange={(e) => updateFormField("cuisine", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              >
                {DUMMY_CUISINES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Tag size={16} />
            Basic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g. Paneer Tikka, Veg Burger, Cold Coffee"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* SKU / Code */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                SKU / Code
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateFormField("sku", e.target.value)}
                placeholder="e.g. MAIN-PAN-TIKKA-01"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Veg Type + Active + Recommended / Customizable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Type
              </label>
              <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => handleVegTypeChange("veg")}
                  className={
                    "px-3 py-1.5 flex items-center gap-1 " +
                    (form.veg_type === "veg"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-slate-600")
                  }
                >
                  <Utensils size={12} />
                  Veg
                </button>
                <button
                  type="button"
                  onClick={() => handleVegTypeChange("non_veg")}
                  className={
                    "px-3 py-1.5 flex items-center gap-1 " +
                    (form.veg_type === "non_veg"
                      ? "bg-red-100 text-red-700"
                      : "text-slate-600")
                  }
                >
                  <Utensils size={12} />
                  Non-Veg
                </button>
                <button
                  type="button"
                  onClick={() => handleVegTypeChange("egg")}
                  className={
                    "px-3 py-1.5 flex items-center gap-1 " +
                    (form.veg_type === "egg"
                      ? "bg-yellow-100 text-yellow-700"
                      : "text-slate-600")
                  }
                >
                  <Utensils size={12} />
                  Egg
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <label className="block text-xs font-medium text-slate-600">
                Visibility & Tags
              </label>
              <div className="flex flex-wrap gap-3 text-xs">
                <label className="inline-flex items-center gap-1 text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      updateFormField("is_active", e.target.checked)
                    }
                    className="h-3.5 w-3.5 text-slate-900 border-slate-300 rounded"
                  />
                  Active on menu
                </label>
                <label className="inline-flex items-center gap-1 text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_recommended}
                    onChange={(e) =>
                      updateFormField("is_recommended", e.target.checked)
                    }
                    className="h-3.5 w-3.5 text-slate-300 rounded"
                  />
                  Recommended / Chef’s Special
                </label>
                <label className="inline-flex items-center gap-1 text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_customizable}
                    onChange={(e) =>
                      updateFormField("is_customizable", e.target.checked)
                    }
                    className="h-3.5 w-3.5 text-slate-300 rounded"
                  />
                  Customizable (toppings etc.)
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              placeholder="Short description visible to customers / staff..."
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 resize-none"
            />
          </div>
        </section>

        {/* Food & Service Details */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info size={16} />
            Food & Service Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Spice level */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Spice Level
              </label>
              <select
                value={form.spice_level}
                onChange={(e) =>
                  handleSpiceLevelChange(e.target.value)
                }
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              >
                {SPICE_LEVELS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prep time */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Approx. Prep Time (mins)
              </label>
              <div className="relative">
                <Timer
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  min="0"
                  value={form.prep_time_mins}
                  onChange={(e) =>
                    updateFormField("prep_time_mins", e.target.value)
                  }
                  placeholder="e.g. 10"
                  className="w-full pl-8 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateFormField("tags", e.target.value)}
                placeholder="e.g. spicy, kids, jain, gluten-free"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Allergen Information
            </label>
            <textarea
              rows={2}
              value={form.allergens}
              onChange={(e) => updateFormField("allergens", e.target.value)}
              placeholder="e.g. Contains dairy, nuts, gluten. Suitable for Jain on request."
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Flame size={11} className="text-slate-300" />
              Helps with safety and guest communication.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <IndianRupee size={16} />
            Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base price */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Base Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.base_price}
                onChange={(e) => updateFormField("base_price", e.target.value)}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.tax_rate}
                onChange={(e) => updateFormField("tax_rate", e.target.value)}
                placeholder="e.g. 18"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Package size={16} />
              Variants (Optional)
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <Plus size={12} />
              Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-xs text-slate-500">
              No variants added. Base product price will be used.
            </p>
          ) : (
            <div className="space-y-3">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-1 sm:grid-cols-[1.5fr,1fr,auto] gap-2 items-center border border-slate-100 rounded-lg px-3 py-2 bg-slate-50"
                >
                  {/* Variant name */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(idx, "name", e.target.value)
                      }
                      placeholder="e.g. Half / Full, Small / Large"
                      className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  {/* Price delta */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Price Change (₹)
                    </label>
                    <input
                      type="number"
                      value={variant.price_delta}
                      onChange={(e) =>
                        handleVariantChange(idx, "price_delta", e.target.value)
                      }
                      placeholder="e.g. 0, 30, -10"
                      className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  {/* Default + remove */}
                  <div className="flex items-center justify-end gap-2 mt-2 sm:mt-5">
                    <label className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={variant.is_default}
                        onChange={(e) =>
                          handleVariantChange(
                            idx,
                            "is_default",
                            e.target.checked
                          )
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300"
                      />
                      Default
                    </label>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
                        aria-label="Remove variant"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Image */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ImageIcon size={16} />
            Product Image (Optional)
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-20 w-20 rounded-lg border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon size={20} className="text-slate-400" />
              )}
            </div>
            <div>
              <label className="text-xs text-slate-700 mb-1 block">
                Upload thumbnail image
              </label>
              <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                <ImageIcon size={14} />
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Recommended: square PNG/JPG, at least 600x600px.
              </p>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {error && <div className="text-red-600 mb-1">{error}</div>}
            {saved && !error && (
              <div className="inline-flex items-center gap-1 text-emerald-600">
                <CheckCircle2 size={12} />
                Product saved successfully (dummy).
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Package size={14} />
                  Save Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
