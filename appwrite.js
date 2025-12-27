const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_MOVIES_TABLE_ID;

import * as Appwrite from "appwrite";
console.log(Appwrite);

const client = new Appwrite.Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Appwrite.Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Appwrite.Query.equal("searchTerm", searchTerm),
    ]);
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await databases.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, TABLE_ID, Appwrite.ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie ? movie.id : null,
        poster_url: movie ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Appwrite.Query.orderDesc("count"),
      Appwrite.Query.limit(5),
    ]);
    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}