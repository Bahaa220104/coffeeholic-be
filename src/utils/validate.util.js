export default function validateObject(allowedFields, data) {
  const value = {};
  allowedFields.forEach((field) => {
    if (Object.keys(data).includes(field)) {
      value[field] = data[field];
    }
  });

  return value;
}
