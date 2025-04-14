import { FormattedProperties, TiledProperty } from "type";

export const formatProperties = <Name extends string>(
  properties: TiledProperty[],
) => {
  try {
    const formatted = properties.reduce((acm, prop) => {
      acm[prop.name as Name] = prop;
      return acm;
    }, {} as FormattedProperties<Name>);

    return formatted;
  } catch (e) {
    console.error("wrong property", e);
    throw new Error(`wrong property: ${JSON.stringify(properties)}`);
  }
};
