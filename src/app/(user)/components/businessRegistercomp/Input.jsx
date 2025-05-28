export default function Input({ label, name, value, onChange, ...props }) {
  return (
    <div>
      <label className="font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        {...props}
      />
    </div>
  );
}
