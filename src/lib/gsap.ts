import { gsap } from "gsap";

let registrationPromise: Promise<typeof gsap> | null = null;

export function getGSAP() {
  if (typeof window === "undefined") {
    return Promise.resolve(gsap);
  }

  registrationPromise ??= import("gsap/ScrollTrigger").then(
    ({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      return gsap;
    },
  );

  return registrationPromise;
}

export function createGSAPContext(
  setup: (animation: typeof gsap) => void,
  scope: Element | React.RefObject<Element | null>,
) {
  let context: gsap.Context | undefined;
  let cancelled = false;

  void getGSAP().then((animation) => {
    if (!cancelled) {
      context = animation.context(() => setup(animation), scope);
    }
  });

  return () => {
    cancelled = true;
    context?.revert();
  };
}
