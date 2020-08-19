import { client } from "./GqlClient"
import { gql } from "@apollo/client";

export type GqlTypes = "Int" | "Float" | "String" | "Boolean" | "ID"
export interface EntityProp {
  name: string;
  type: string;
  required: boolean;
}
export const getCachedItems = (entity: string) => {
  const serializedState = client.cache.extract()
  const result: any[] = [];
  for (var [k, v] of Object.entries(serializedState)) if (k.indexOf(entity + ":") >= 0) result.push(v);
  return result;
}

export const createQueryToGetItems = (entityName: string, properties: string[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const entitiesName = entityName.toLowerCase() + "s"
  const attr = properties.map(s => s !== "id" ? `          ${s}` : "").join("\n")
  const GET_QUERY = gql`
    query ${formatedEntityName} {
      ${entitiesName} {
        count
        limit
        offset
        items {
          id\n${attr}
        }
      }
    }
    `;
  return GET_QUERY
}

export const createMutationToCreateItem = (entityName: string, properties: EntityProp[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const varDef = properties.map(p => `$${p.name}: ${p.type}` + (p.required ? "!" : "")).join(", ")
  const dataDef = properties.map(p => `${p.name}: $${p.name}`).join(", ")
  const attr = properties.map(s => s.name !== "id" ? `      ${s.name}` : "").join("\n")
  const CREATE_MUTATION = gql`
    mutation Create${formatedEntityName}(${varDef}) {
      create${formatedEntityName}(data: { ${dataDef} }) {
        id\n${attr}
      }
    }
  `;
  return CREATE_MUTATION;
}


export const createMutationToUpdateItem = (entityName: string, properties: EntityProp[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const varDef = properties.map(p => p.name !== "id" ? (`$${p.name}: ${p.type}` + (p.required ? "!" : "")): "").join(", ")
  const dataDef = properties.map(p => p.name !== "id" ? `${p.name}: $${p.name}` : "").join(", ")
  const attr = properties.map(s => s.name !== "id" ? `      ${s.name}` : "").join("\n")
  const UPDATE_MUTATION = gql`
    mutation Update${formatedEntityName}($id: Int!, ${varDef}) {
      update${formatedEntityName}(id: $id, data: {${dataDef} }) {
        id\n${attr}
      }
    }
  `;
  return UPDATE_MUTATION;
}

export const createMutationToDeleteItem = (entityName: string) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const REMOVE_MUTATION = gql`
    mutation Remove${formatedEntityName}($id: Int!) {
      delete${formatedEntityName}(id: $id)
    }
  `;
  return REMOVE_MUTATION;
}

export const createQueryToSubscribe = (entityName: string, properties: string[]) => {
  const entitiesName = entityName.toLowerCase() + "s"
  const attr = properties.map(s => s !== "id" ? `        ${s}` : "").join("\n")
  const SUBSCRIPTION_QUERY = gql`
    subscription {
      ${entitiesName}Subscription {
        id\n${attr}
      }
    }
    `;
  return SUBSCRIPTION_QUERY
}
