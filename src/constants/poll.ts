type PollData = {
  title: string;
  questions: {
    question: string;
    options: string[];
  }[];
};

export const pollData: PollData = {
  title: "Choose your best answer!",
  questions: [
    {
      question: "What part is the best?",
      options: ["Part I", "Part II", "Part III"],
    },
    {
      question: "What character is your favourite?",
      options: ["Marty", "Doc", "Jennifer", "Einstein", "Other"],
    },
    {
      question: "Best transport device in the trilogy?",
      options: ["DeLorean", "Train time machine", "Hoverboard"],
    },
    {
      question: "What Jennifer do you like more?",
      options: ["Claudia Wells", "Elisabeth Shue"],
    },
  ],
};
