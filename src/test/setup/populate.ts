import { faker } from "@faker-js/faker";
import { getDatabase, tweets, users } from "~/db";

(async () => {
  const db = await getDatabase({ get: (key) => process.env[key] });

  for (let i = 0; i < 25; i++) {
    const newUser = await db
      .insert(users)
      .values({ email: faker.internet.email(), name: faker.person.fullName(), id: faker.string.nanoid() })
      .returning()
      .get();
    console.log(`Created user: "${newUser.name}"`);

    await db
      .insert(tweets)
      .values({ authorId: newUser.id, content: faker.word.words(25) })
      .run();
    await db
      .insert(tweets)
      .values({ authorId: newUser.id, content: faker.word.words(25) })
      .run();
  }
})();
