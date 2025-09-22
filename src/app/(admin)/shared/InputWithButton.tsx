type InputWithButtonProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
  buttonText: string;
};

const InputWithButton = ({
  value,
  onChange,
  onAdd,
  placeholder,
  buttonText,
}: InputWithButtonProps) => {
  return (
    <div className="flex space-x-2 mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
      <button
        onClick={onAdd}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default InputWithButton;
