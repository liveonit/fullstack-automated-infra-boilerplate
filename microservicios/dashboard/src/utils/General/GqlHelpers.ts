import { client } from "./GqlClient"
import { gql } from "@apollo/client";
import _ from "lodash";

export type GqlTypes = "Int" | "Float" | "String" | "Boolean" | "ID" | "[String!]"


export interface EntityProp {
  name: string;
  type: GqlTypes;
  required: boolean;
}

export const getCachedItems = (entityName: string, properties: string[]) => {
  const entitiesName = entityName.toLowerCase() + "s"
  const attr = properties.map(s => s !== "id" ? `        ${s}` : "").join("\n")
  const result = client.readQuery({
    query: gql`
    query Read${entityName}s {
      ${entitiesName} {
        id\n${attr}
      }
    }`
  })
  return (result && result[entitiesName]) || []
}

declare global {
  interface Window {
    getCacheItems: any;
    test: any;
  }
}

window.getCacheItems = getCachedItems;



export const createQueryToGetItems = (entityName: string, properties: EntityProp[], variables?: EntityProp[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const entitiesName = entityName.toLowerCase() + "s"
  const attr = properties.map(s => s.name !== "id" ? `        ${s.name}` : "").join("\n")
  const varsString = variables?.map((s,k) => `${k===0 ?"(" : ""}${s.name} : ${s.type}${s.required ? "!" : ""}${k===(variables.length-1) ?")" : ""}`).join(", ") || ""
  const GET_QUERY = gql`
    query ${formatedEntityName}${varsString} {
      ${entitiesName} {
        id\n${attr}
      }
    }
    `;
  return GET_QUERY
}

export const createMutationToCreateItem = (entityName: string, properties: EntityProp[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const varDef = properties.map(p =>  p.name !== "id" ? `$${p.name}: ${p.type}` + (p.required ? "!" : "") : "").join(", ")
  const dataDef = properties.map(p =>  p.name !== "id" ? `${p.name}: $${p.name}`: "").join(", ")
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
  const varDef = properties.map(p => p.name !== "id" ? (`$${p.name}: ${p.type}` + (p.required ? "!" : "")) : "").join(", ")
  const dataDef = properties.map(p => p.name !== "id" ? `${p.name}: $${p.name}` : "").join(", ")
  const attr = properties.map(s => s.name !== "id" ? `      ${s.name}` : "").join("\n")
  const UPDATE_MUTATION = gql`
    mutation Update${formatedEntityName}($id: ${_.find(properties, { name: 'id' })?.type || 'Int'}!, ${varDef}) {
      update${formatedEntityName}(id: $id, data: {${dataDef} }) {
        id\n${attr}
      }
    }
  `;
  return UPDATE_MUTATION;
}

export const createMutationToDeleteItem = (entityName: string, properties: EntityProp[]) => {
  const formatedEntityName = entityName.charAt(0).toUpperCase() +
    entityName.slice(1).toLowerCase()
  const REMOVE_MUTATION = gql`
    mutation Remove${formatedEntityName}($id: ${_.find(properties, { name: 'id' })?.type || 'Int'}!) {
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
