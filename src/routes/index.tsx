import { component$ } from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  server$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { TweetPreview } from "~/components/TweetPreview";
import { getDatabase, tweets, users } from "~/db";
import { getAuth } from "./plugin@auth";

export const useTweets = routeLoader$(async (req) => {
  const db = await getDatabase(req.env);
  const auth = await getAuth(req);

  if (!auth?.user?.email) return [];

  const user = await db.query.users.findFirst({
    where: eq(users.email, auth.user.email),
  });

  if (!user) return [];

  const data = await db.query.users.findFirst({
    where: eq(users.email, auth.user.email),
    with: {
      follows: {
        with: {
          followedUser: {
            with: {
              tweets: true,
            },
          },
        },
      },
    },
  });

  if (!data) return [];

  return data.follows.flatMap((u) =>
    u.followedUser?.tweets.map((t) => ({
      author: {
        id: u.followedUser?.id ?? "",
        name: u.followedUser?.name ?? "",
      },
      tweet: t,
    }))
  );
});

export const createTweet = server$(async function () {
  const auth = await getAuth(this);
  const db = await getDatabase(this.env);

  if (!auth?.user?.email) return;

  const user = await db.query.users.findFirst({
    where: eq(users.email, auth.user.email),
  });

  if (!user) return;

  const newTweet = await db
    .insert(tweets)
    .values({ content: "Some New Tweet", authorId: user.id })
    .returning()
    .get();

  return { ...newTweet, author: user };
});

export default component$(() => {
  const currentTweets = useTweets();

  return (
    <div class="divide-y divide-gray-100">
      <div class="p-4">
        <h1 class="font-bold">Home</h1>
      </div>
      {currentTweets.value.length > 0 && (
        <div class="flex flex-col divide-y overflow-hidden">
          {currentTweets.value.map(
            (t) =>
              t && (
                <Link
                  key={t.tweet.id}
                  href={`/${t.author.id}/status/${t.tweet.id}`}
                >
                  <TweetPreview tweet={t.tweet} author={t.author} />
                </Link>
              )
          )}
        </div>
      )}
      {currentTweets.value.length === 0 && (
        <p class="font-medium text-sm text-gray-800 text-center my-16">
          No items
        </p>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Starter",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
