import { yupResolver } from "@hookform/resolvers/yup";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button, Container, Flex, IconButton, Link, Text, TextField } from "@radix-ui/themes";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ShowIf from "@/components/show-if";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(10).max(64).required(),
  })
  .required();

export function Component() {
  // State
  const [showPassword, togglePassword] = useToggle(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Handlers
  const onSubmit = (data: yup.InferType<typeof schema>) => {
    console.log("HERE", data);
  };

  console.log(import.meta.env);

  return (
    <Container size="1">
      <div className="-mt-20 flex min-h-screen flex-col justify-center space-y-4 px-5">
        <img src="/flag-in-hole.svg" alt="logo" className="mx-auto h-16 w-16" />
        <Text size="6" align="center" weight="medium">
          Sign up to <strong>Stacy</strong>
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Root placeholder="Email" size="3" {...register("email")} />

            <TextField.Root placeholder="Password" size="3" type={showPassword ? "text" : "password"} {...register("password")}>
              <TextField.Slot side="right">
                <IconButton onClick={() => togglePassword()} type="button" variant="ghost" className="cursor-pointer" radius="full">
                  <ShowIf condition={showPassword}>
                    <EyeOpenIcon height="16" width="16" />
                  </ShowIf>
                  <ShowIf condition={!showPassword}>
                    <EyeClosedIcon height="16" width="16" />
                  </ShowIf>
                </IconButton>
              </TextField.Slot>
            </TextField.Root>

            <ShowIf condition={!!errors.email || !!errors.password}>
              <Flex direction="column" gap="0" className="text-orange-600">
                <Text size="2">
                  <strong>Error:</strong> {[errors.email?.message, errors.password?.message].filter((t) => Boolean(t)).join(", ")}
                </Text>
              </Flex>
            </ShowIf>

            <Button size="3" type="submit" className="cursor-pointer">
              Create Account
            </Button>
          </Flex>
        </form>
        <Flex>
          <Link href="/login" className="text-gray-500 underline" size="2">
            I already have an account
          </Link>
        </Flex>
        <ShowIf condition={import.meta.env.VITE_ALLOW_GITHUB_SSO === "true" || import.meta.env.VITE_ALLOW_GOOGLE_SSO === "true"}>
          <hr />
          <Flex gap="2" direction="column">
            <ShowIf condition={import.meta.env.VITE_ALLOW_GOOGLE_SSO === "true"}>
              <Button size="3" type="button" className="cursor-pointer py-1" variant="outline" color="gray">
                <img src="/google.svg" alt="continue-with-google" className="h-6 w-6" /> Continue with Google
              </Button>
            </ShowIf>
            <ShowIf condition={import.meta.env.VITE_ALLOW_GITHUB_SSO === "true"}>
              <Button size="3" type="button" className="cursor-pointer py-1" variant="outline" color="gray">
                <img src="/github.svg" alt="continue-with-github" className="h-6 w-6" /> Continue with GitHub
              </Button>
            </ShowIf>
          </Flex>
        </ShowIf>
      </div>
    </Container>
  );
}
