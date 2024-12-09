export default function compareArrays(
  arr1,
  arr2,
  equalityFunction = (e1, e2) => e1.id == e2.id
) {
  const exclusiveToArr1 =
    arr1?.filter(
      (item) => !arr2?.some((otherItem) => equalityFunction(item, otherItem))
    ) || [];

  const exclusiveToArr2 =
    arr2?.filter(
      (item) => !arr1?.some((otherItem) => equalityFunction(item, otherItem))
    ) || [];

  const commonElements =
    arr2?.filter((item) =>
      arr1?.some((otherItem) => equalityFunction(item, otherItem))
    ) || [];

  const commonElementsOld =
    arr1?.filter((item) =>
      arr2?.some((otherItem) => equalityFunction(item, otherItem))
    ) || [];

  return [exclusiveToArr1, exclusiveToArr2, commonElements, commonElementsOld];
}
