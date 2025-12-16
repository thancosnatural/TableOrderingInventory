function Field({ field, value, error, onChange }) {
  const baseCls =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200";
  const cls = `${baseCls} ${error ? "border-red-500" : "border-gray-200"}`;

  if (field.type === "select") {
    return (
      <select
        name={field.key}
        value={value ?? ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={cls}
        disabled={!!field.disabled}
      >
        <option value="">{field.placeholder ?? "Select"}</option>
        {(field.options || []).map((opt) => {
          const v = typeof opt === "string" ? opt : opt.value;
          const l = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={String(v)} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.key}
        value={value ?? ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={cls}
        rows={field.rows ?? 4}
        disabled={!!field.disabled}
      />
    );
  }

  return (
    <input
      type={field.type || "text"}
      name={field.key}
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className={cls}
      disabled={!!field.disabled}
    />
  );
}

export default Field