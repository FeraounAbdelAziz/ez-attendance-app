import DatePicker from "./DataPicker";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

function FormikControl(props : any) {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case "select":
      return <Select {...rest} />;
    // case "radio":
    //   return <RadioButton {...rest} />;
    case "checkbox":
    case "date":
      return <DatePicker {...rest} />;
    case "chakraInput":
    default:
      return null;
  }
}

export default FormikControl;