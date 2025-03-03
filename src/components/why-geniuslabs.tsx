import Image from "next/image"

export default function WhyGeniusLabs() {
  return (
    <div className="max-w-md mx-auto">
      <div className="px-4 py-8 sm:py-12">
        <h1 className="text-lg xxs:text-base font-bold text-[#073763] mb-4 sm:mb-6">Why book GeniusLabs Workshops ?</h1>

        <div className="grid grid-cols-1 gap-16 pr-4">
          {/* Futuristic Curriculum - 1st */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_30%] [&>div:last-child]:flex-[0_0_70%]">
            <div>
              <Image
                src="/logo/logo.png"
                alt="Tools and gears icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
            <div className="flex flex-col justify-center text-center pr-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                Upskill your child in Robotics, Coding, AI
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                GeniusLabs offers a wide range of workshops for young children, that can help students gain conceptual
                knowledge and also build interest in the field of Robotics, Coding, ICT and AI
              </p>
            </div>
          </div>

          {/* Global Certifications - 2nd */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_70%] [&>div:last-child]:flex-[0_0_30%]">
            <div className="flex flex-col justify-center text-center pl-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                Powered by LEGO Education and Premium Partners
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                Robotics, IOT, AI can be highly engaging with the right hardware. At GeniusLabs we use quality robotics
                kits like LEGO Spike Essential, LEGO EV3 Mindstorm, LEGO BricQ, LEGO Robot Inventor
              </p>
            </div>
            <div>
              <Image
                src="/logo/logo.png"
                alt="Certificate icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
          </div>

          {/* Staying A Step Ahead - 3rd */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_30%] [&>div:last-child]:flex-[0_0_70%]">
            <div>
              <Image
                src="/logo/logo.png"
                alt="Brain and lightbulb icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
            <div className="flex flex-col justify-center text-center pr-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                Beginners Friendly Popular Workshops
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                Robotics, Coding and AI workshops have become a craze with students. With guided lesson plans, LEGO
                instructions, age appropriate lab activities, GeniusLabs workshops are highly suitable for children
                beginning in Robotics, Coding and AI
              </p>
            </div>
          </div>

          {/* Expert Instructors - 4th */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_70%] [&>div:last-child]:flex-[0_0_30%]">
            <div className="flex flex-col justify-center text-center pl-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                IIT-IIM Graduates as Faculty
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                Workshops and regular classes are conducted at our Labs located at Skymark Sec 98 and all our faculty
                are either IIT-IIM, MTech in Computers or Electronics. We Believe our Students Deserve the Best!
              </p>
            </div>
            <div>
              <Image
                src="/logo/logo.png"
                alt="Expert instructor icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
          </div>

          {/* Interactive Learning - 5th */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_30%] [&>div:last-child]:flex-[0_0_70%]">
            <div>
              <Image
                src="/logo/logo.png"
                alt="Interactive learning icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
            <div className="flex flex-col justify-center text-center pr-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                Discover Child&apos; True Interest
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                Discover if your child interests truly lies in Robotics and Coding
              </p>
            </div>
          </div>

          {/* Personalized Attention - 6th */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 [&>div:first-child]:flex-[0_0_70%] [&>div:last-child]:flex-[0_0_30%]">
            <div className="flex flex-col justify-center text-center pl-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0b5394] mb-1 text-center">
                Earn Certificates, Genius Points and STEM Goodies
              </h2>
              <p className="text-xs sm:text-sm text-[#073763] text-center">
                As kids complete multiple robotics and coding missions and demonstrate team work, critical thinking they
                earn multiple rewards during the workshop.
              </p>
            </div>
            <div>
              <Image
                src="/logo/logo.png"
                alt="Personalized attention icon"
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

