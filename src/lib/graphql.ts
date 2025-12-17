// GraphQL client configuration
const GRAPHQL_ENDPOINT = "http://localhost:8080/query";

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlQuery<T>(
  query: string,
  variables?: Record<string, any>,
  operationName?: string
): Promise<GraphQLResponse<T>> {
  try {
    // Match plg-crm-dashboard structure: operationName, query, variables as top-level fields
    const requestBody: {
      operationName?: string;
      query: string;
      variables?: Record<string, any>;
    } = {
      query,
    };
    
    // Add operationName if provided (top-level field, like plg-crm-dashboard)
    if (operationName) {
      requestBody.operationName = operationName;
    }
    
    // Add variables if provided
    if (variables) {
      requestBody.variables = variables;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      const text = await response.text();
      throw new Error(`GraphQL request failed: ${response.statusText}. Response: ${text}`);
    }

    if (!response.ok) {
      const errorMessage = result?.errors?.[0]?.message || result?.message || response.statusText;
      console.error("GraphQL request failed:", {
        status: response.status,
        statusText: response.statusText,
        errors: result?.errors,
        message: result?.message,
        requestBody,
      });
      throw new Error(`GraphQL request failed: ${errorMessage}`);
    }

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || "GraphQL error";
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    console.error("GraphQL query error:", error);
    throw error;
  }
}

