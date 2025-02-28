/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addCompletedLesson = /* GraphQL */ `
  mutation AddCompletedLesson($userId: ID!, $lessonIndex: Int!) {
    addCompletedLesson(userId: $userId, lessonIndex: $lessonIndex) {
      userId
      completedLessonIndices
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAllCompletedLessons = /* GraphQL */ `
  mutation DeleteAllCompletedLessons($userId: ID!) {
    deleteAllCompletedLessons(userId: $userId) {
      success
      __typename
    }
  }
`;
