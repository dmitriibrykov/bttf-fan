import { motion } from "framer-motion";
import { Timeline } from "@/models/Timeline";

type Props = {
  selectedEvent: Timeline;
};

export default function TimelineContent({ selectedEvent }: Props) {
  return (
    <motion.div
      key={`${selectedEvent.year}-${selectedEvent.branch}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-8"
    >
      <div className="flex flex-col md:block">
        <img
          src={selectedEvent.imgSrc}
          alt="bttf-photo"
          className="float-left mb-8 md:mb-0 md:mr-8 max-w-[400px] h-auto w-full object-fill"
        />
        <h1>{selectedEvent.title}</h1>
        <p className="text-muted-foreground">{selectedEvent.description}</p>
        <p>{selectedEvent.mainText}</p>
      </div>
    </motion.div>
  );
}
