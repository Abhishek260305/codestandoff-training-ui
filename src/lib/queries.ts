// GraphQL queries for questions

export const GET_QUESTIONS_QUERY = `
  query GetQuestions($input: GetQuestionsRequest!) {
    getQuestions(input: $input) {
      questions {
        id
        title
        slug
        description
        difficulty
        topics
        testCaseCount
      }
      totalCount
      hasMore
    }
  }
`;
