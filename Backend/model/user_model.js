// model User_Spam {
//   // Use 'Int' for PostgreSQL auto-incrementing primary keys
//   id Int @id @default(autoincrement())
//   name String
//   email String @unique
  
//   password String?
  
//   googleId String?      @unique
//   profilePicture String?
//   authMethods AuthMethod
  
//   // Relation field to link to the Post_Spam model
//   posts Post_Spam[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   // Recommended: Use a @map to define the table name in the database
//   @@map("user_spam") 
// }

// id
// name
// email 
// password 
// googleId 
// peofilePicture 
// authMethod 
// createdAt 
// updatedAt 
