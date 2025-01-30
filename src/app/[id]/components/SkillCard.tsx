import Image from "next/image";

interface SkillCardProps {
  skills: string[];
}

const images = [
  "/icons/Creativity.svg",
  "/icons/Critical-Thinking.svg",
  "/icons/Collaboration.svg",
  "/icons/Leadership.svg",
  "/icons/Problem-Solving.svg",
  "/icons/Adaptability.svg",
];

const SkillCard = ({ skills }: SkillCardProps) => (
  <div className="">
    <h2 className="text-base custom-font font-bold mb-2">
      Skills that make you future ready!
    </h2>
    <div className="grid grid-cols-3 gap-x-3 gap-y-2">
      {skills.map((skill, index) => (
        <div
          key={skill}
          className="bg-white rounded-xl p-3 flex flex-col items-center shadow-[0_4px_8px_0px_#00000014]"
        >
          <Image
            src={images[index % images.length]}
            alt="Skill Icon"
            width={40}
            height={40}
            className="m-2"
          />
          <span className="text-xs custom-font font-medium text-center">
            {skill}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default SkillCard;
