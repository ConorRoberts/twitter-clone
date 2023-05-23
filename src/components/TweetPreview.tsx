import { component$ } from "@builder.io/qwik";
import type { Tweet, User } from "~/db";

export const TweetPreview = component$<{
  tweet: Tweet;
  author?: Omit<User, "email">;
}>((props) => {
  return (
    <div class="p-4 text-sm hover:bg-gray-50 transition duration-75 w-full h-full text-left">
      <p class="font-medium">
        #{props.tweet.id} - {props.tweet.content}
      </p>
      {props.author && (
        <p class="text-xs text-gray-600">{props.author?.name}</p>
      )}
    </div>
  );
});
