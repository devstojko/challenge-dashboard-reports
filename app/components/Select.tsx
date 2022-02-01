type TOption = {
  label: string;
  value: string;
};

type TSelectProps = {
  name: string;
  defaultOption: {
    label: string;
    value: string;
  };
  defaultValue: string;
  options: TOption[];
};

export default function Select({ defaultOption, name, options, defaultValue }: TSelectProps) {
  return (
    <select defaultValue={defaultValue} name={name} className="select-input">
      <option value={defaultOption.value}>{defaultOption.label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
