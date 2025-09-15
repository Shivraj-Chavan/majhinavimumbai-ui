export default function Input({ label, name,required=false, value, onChange, ...props }) {
  return (
    <div>
      <label className="font-semibold text-gray-700">{label}
{required
&&
<span className="text-red-500">*</span>
}

      </label>
      <input
        type="text"
        required={required}
        name={name}
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ""}
        onChange={onChange}
        placeholder={label}
        {...props}
      />
    </div>
  );
}
