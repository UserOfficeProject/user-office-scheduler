import 'reflect-metadata';

const metadataKey = Symbol('Response');

export function Response(): (target: object, propertyKey: string) => void {
  return (target: object, propertyKey: string) => {
    let properties: string[] = Reflect.getMetadata(metadataKey, target);

    if (properties) {
      properties.push(propertyKey);
    } else {
      properties = [propertyKey];
      Reflect.defineMetadata(metadataKey, properties, target);
    }
  };
}

function getResponseFields(origin: object): Record<string, unknown> {
  const properties: string[] = Reflect.getMetadata(metadataKey, origin) || [];
  const result: Record<string, unknown> = {};
  properties.forEach(
    (key) => (result[key] = (origin as Record<string, unknown>)[key])
  );

  return result;
}

export function getResponseField(origin: object): string | null {
  const responseFields = getResponseFields(origin);
  const keys = Object.keys(responseFields);
  if (keys.length !== 1) {
    // response wrapper must have one and only one key decorated with @Response
    return null;
  }

  return keys[0];
}
