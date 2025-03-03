import Image from "next/image"

export default function EducationStats() {
  return (
    <div className="mt-16 p-2 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-8">
        <div className="text-center space-y-2 px-2">
          <h1 className="text-lg xxs:text-base font-extrabold text-[#073763] mb-10">Popular Robotics Coding AI Workshops</h1>
          <h2 className="text-base xxs:text-sm text-[#073763] px-1 pb-5">
            Upskill your children by choosing the right robotics, coding, AI workshops near your home
          </h2>
        </div>

        {/* First Row */}
        <div className="flex flex-row justify-evenly gap-2 mb-5 mt-10">
          {/* Faculty Card */}
          <div className="bg-[#90deff] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 flex items-center justify-center">
                <Image
                  src="/logo/drone.png"
                  alt="Book the drone building workshops near you in Noida Gautam Budh Nagar and Delhi NCR locations! Designed for children aged 8–14, these hands-on Drone Building Workshops teach the fundamentals of aerodynamics, engineering, and coding. Kids practice complex building, coding, and testing prototypes while upskilling in Robotics, Coding, and AI. Fun lab activities include flight challenges, obstacle courses, and AI integration projects. Skill Gained: Circuit design, programming logic, spatial awareness, and teamwork. These workshops are perfect for young children and aspiring inventors ready to build using arduino and raspberry pi , code using python, and improve their tech and AI  skills in a fun and learning environment.School-aged children will be in the forefront of AI era and discover how drones work and unlock their creativity through practical, real-world applications. Discover the genius in your child with the GeniusLabs Drone Building Workshops, where they can practice building product prototypes and learn about hardware and software integration. Fun and  engaging robotics workshops make learning an adventure"
                  width={78}
                  height={78}
                  className="w-20 h-20 object-cover"
                />
              </div>
            </div>

            <p className="text-[10px] font-bold">Drone Building</p>
          </div>

          {/* Courses Card */}
          <div className="bg-[#f3f3f3] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 flex items-center justify-center">
                <Image
                  src="/logo/cat.png"
                  alt="Enroll your child in GeniusLabs  Scratch Game Development Workshops near you in Noida Gautam Budh Nagar or Delhi NCR. Our coding workshops are highly suitable for children aged 6 to 16 years. Our highly engaging workshops teach the coding basics through interactive game development, animation and storytelling. Along with coding, our lab activities include STEM games, collaborative challenges, and mini competitions. Skill Gained: Algorithm design, problem-solving, coding skills, and digital literacy. These workshops are most loved by school students from The Shriram Millennium School, Kothari International School, Genesis Global School, Lotus Valley International School, Pathways and Prometheus. Book Now to let your child be at the forefront of AI era and learn the  game development process. Discover how Scratch coding methodology fosters creativity and logical thinking in a playful way."
                  width={78}
                  height={78}
                  className="w-20 h-20 object-cover"
                />
              </div>
            </div>

            <p className="text-[10px] font-bold">Game Development with Scratch</p>
          </div>

          {/* Students Card */}
          <div className="bg-[#90deff] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 flex items-center justify-center">
                <Image
                  src="/logo/cart.png"
                  alt="Students icon"
                  width={78}
                  height={78}
                  className="w-20 h-20 object-cover"
                />
              </div>
            </div>

            <p className="text-[10px] font-bold">LEGO Robotics and Coding</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-row justify-evenly gap-2">
          {/* Research Card */}
          <div className="bg-[#90deff] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 flex items-center justify-center">
                <Image
                  src="/logo/lego.webp"
                  alt="Research icon"
                  width={78}
                  height={78}
                  className="w-20 h-20 object-cover"
                />
              </div>
            </div>
            <p className="text-[10px] font-bold">Smart Robots</p>
          </div>

          {/* Labs Card */}
          <div className="bg-[#f3f3f3] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-24 flex items-center justify-center">
                <Image src="/logo/logo.png" alt="Labs icon" width={78} height={78} className="w-20 h-20 object-cover" />
              </div>
            </div>
            <p className="text-[10px] font-bold">AI Game with Python</p>
          </div>

          {/* Publications Card */}
          <div className="bg-[#90deff] rounded-lg pt-8 pb-3 px-2 text-center text-[#073763] shadow-md flex-1 relative min-h-[80px] flex flex-col justify-center max-w-[100px]">
            <div className="flex justify-center absolute -top-20 left-1/2 -translate-x-1/2">
              <div className="w-32 flex items-center justify-center">
                <Image
                  src="/logo/Roblox.png"
                  alt="Roblox icon"
                  width={108}
                  height={108}
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
            <p className="text-[10px] font-bold">Games with Roblox Lua Scripting</p>
          </div>
        </div>

        <h1 className="text-xl xxs:text-base font-bold text-center text-[#073763]">BUILD . CODE . IMPROVE</h1>
      </div>
    </div>
  )
}

