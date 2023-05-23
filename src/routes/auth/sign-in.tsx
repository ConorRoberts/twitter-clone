import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignin, useAuthSignout } from "../plugin@auth";

export default component$(() => {
  const signIn = useAuthSignin();
  const authSession = useAuthSession();
  const signOut = useAuthSignout();

  return (
    <div>
      {authSession.value !== null && (
        <h1 class="text-3xl text-center font-bold">
          {authSession.value.user?.name}
        </h1>
      )}
      <div class="flex justify-center gap-2 items-center">
        {authSession.value === null && (
          <Form action={signIn}>
            <input type="hidden" name="providerId" value="github" />
            <button
              type="submit"
              class="bg-gray-100 font-medium text-sm px-4 py-1 transition hover:bg-gray-200 duration-75 rounded-full"
            >
              Sign In
            </button>
          </Form>
        )}
        {authSession.value !== null && (
          <>
            <Form action={signOut}>
              <button
                type="submit"
                class="bg-gray-100 font-medium text-sm px-4 py-1 transition hover:bg-gray-200 duration-75 rounded-full"
              >
                Sign Out
              </button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
});
