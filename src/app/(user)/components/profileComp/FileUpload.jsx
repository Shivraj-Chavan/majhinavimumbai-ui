export default function FileUpload({ label, name, onChange, accept, multiple = false, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        {...props}
        className="border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
