"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type FAQItem = {
  question: string
  answer: string
  images?: {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
    float?: boolean
  }[]
}

const faqData: FAQItem[] = [
  {
    question: "How can I register for the GeniusLabs workshops?",
    answer:
      'It\'s a quick 5 mins process⏰. Visit the GeniusLabs Innovation Centre website at <a href="https://geniuslabs.live">Visit GeniusLabs</a>. Once you\'re on the website, look for: \n\n• Book Now on the top bar or\n• Lego-In-Action Workshops button in STEM Programs or\n• <a href="https://workshops.geniuslabs.live">ENROL NOW</a>\n\nLook for the workshop dates which are open for registration, age groups, and STEM themes. Be quick as the slots are going away faster than we imagined!',
  },
  {
    question: "Do I have to make the payment in advance for the GeniusLabs workshops?",
    answer:
      'Yes, as we have limited slots for each date and age group.\n\n<a href="https://workshops.geniuslabs.live">ENROL NOW</a>\n\n• As you initiate the workshop registration you will share your preferences and then you will be directed to a secure payment gateway 💳 to finalize the payment.\n• Once the payment is successfully processed, you will receive a confirmation email 📧 and SMS📲with comprehensive details about the workshop.\n• On the day of the workshop you will have to show the confirmation SMS or email at the GeniusLabs Innovation Centre. <a href="https://maps.app.goo.gl/bCNM4CGgj6V5tJB46" target="_blank">For directions</a> > Refer : <a href="#Q7">Ques 7</a>\n\nGeniusLabs believes in delivering the best learning experience to its students. <a href="https://www.instagram.com/p/C8v7cEph3-W/" target="_blank">See a workshop in action</a>',
  },
  {
    question: "What will my child learn in the GeniusLabs workshops?",
    answer:
      'Few themes that our workshops are focused on are <strong>Lego-In-Action 🤖, Explore Space 🛰️, Explore Oceans, Around the World 🌍, Car and Bike Stunts 🚴 - Science behind stunts, Towers and Structures 🗼, Habitats and life they support, Science Phenomenons 🔬, Cars and More Cars 🚗.</strong>\n\nThe power of hands-on-learning is undeniable. The quote "What the hand does, the mind remembers" by Dr. Maria Montessori is the guiding principle of the Montessori curriculum and also our GeniusLabs workshops. <strong>What does Larry Page, Sergey Brin and Jeff Bezos all have in common?</strong> - They were all Montessori students. Our theme based hands-on-learning workshops impact children the way they observe the world, learn and innovate.\n\nAs the students engage in interactive, hands-on projects using LEGO education and robotics, they strengthen their fundamentals on:\n\n1. <strong>Product research 🔍, design and innovate</strong> around the main theme\n2. <strong>Robotics development & programming 🧑‍💻</strong> focused around the theme\n3. <strong>Scientific observations 🧑‍🔬</strong> using the product prototypes developed\n\nCollaborating with like-minded peers and mentored by our esteemed faculty from IIT-IIM, children gain tremendous skills in a very short time:\n\n• Ability to build and program through fun, engaging activities\n• Ability to think creatively and solve real-life problems\n• Ability to work in teams and build product prototypes\n\n<strong>Our workshops focus on making learning practical and enjoyable, allowing your child to experiment, collaborate with peers, and apply what they learn in a meaningful way, preparing them for future challenges.</strong> Based on the enrolments, our operations teams create custom STEM planners, gift bags, certificates and theme based idea worksheets in advance.',
  },
  {
    question: "If I am unable to attend the workshop of GeniusLabs, am I eligible for a refund?",
    answer:
      "Unfortunately, our refund policy does not allow this. We do most of the preparation when you block the slot. Our operations teams create custom STEM planners, gift bags, certificates and theme based idea worksheets in advance.\n\n• However, we don't want the parents to lose any monetary value. Thus, if you inform us 2 days before the workshop schedule date, we provide you with a GeniusLabs cash coupon🎟️of equivalent value, that can be redeemed in the next 6 months.\n• In case you wish to discuss how to get the cash coupon, whatsapp us on📱 9468074074 with your 1. Booking confirmation date, 2. Phone number and 3. Student name.",
  },
  {
    question: "Can I change the workshop time slot for the upcoming GeniusLabs workshop?",
    answer:
      "If you require a change in the workshop time slot, please don't hesitate to contact us. Your satisfaction is our priority, and we will make every effort to fulfill your request.\n\n• Whatsapp us at 📱 9468074074 with 1. Booking confirmation date, 2. Phone number and 3. Child's name 4. Current date and slot 5. New date and slot.\n• Our dedicated team will work with you to find an alternative slot that best suits your needs.",
  },
  {
    question: "Is there a difference in the session curriculum for GeniusLabs?",
    answer:
      "Yes. GeniusLabs also offers level based curriculum programs for students from the age of 4-18 years. These curriculum programs are run in batches either on weekdays or weekends.\n\n• Say if you enroll your 8 year old boy, and you wish to strengthen his Robotics Development and Programming skills, Physics and Science Concepts, Coding and Game Development skills, and Product Design and Innovation; you should talk to parents who have enrolled their child in Curious Innovators Programs.\n• The curriculum 📚 for each session is tailored to perfectly match the age group of the children attending.\n\n<div class=\"flex justify-center\"><img src='/stemgames/images/curious.png' alt='curiousimage' class='responsive-img w-full max-w-[300px] mb-[50px]' /></div>\n<div class=\"flex justify-center\"><img src='/stemgames/images/certified.png' alt='certified image' class='responsive-img w-full max-w-[300px] mb-[50px]' /></div>\n\n• Along with Curious Innovators, we offer other skill-building programs such as Curious Innovators, Coding Cadets, Tech Geeks and Design Technology\n\n<div class=\"flex justify-center\"><img src='/stemgames/images/programs.png' alt='Programs 4-18 yrs' class='responsive-img w-full max-w-[300px] mb-[50px]' /></div>\n\n• GeniusLabs is an offline center, however it offers regular tracking of the students' STEM journey online using its app - the parents can observe the projects their and other children are working on via the app. Information on homesheets, design challenges, information on coding and other skill-upgrading events are also provided on our applications.",
    images: [],
  },
  {
    question: "Where is the GeniusLabs Innovation Centre located?",
    answer:
      '📍GeniusLabs Innovation Centre | Shop no. 1, Next to Paytm Office.Skymark One Sector 98 Noida,\n<a href="https://maps.app.goo.gl/bCNM4CGgj6V5tJB46" target="_blank">GeniusLabs Innovation Centre</a>\n\nGeniusLabs Innovation Centre is located in Skymark One, a prominent building along the Noida-Greater Noida Expressway. Skymark One features 2 basements, a podium, 3 multi-level parking floors, and 23 stories, housing various retail outlets like Shoppers Stop, Haldiram, Tim Hortons, Domino\'s, and Starbucks, creating a vibrant commercial atmosphere.\n\nThe building\'s premium entrance lobby, serviced by 9 passenger lifts and 2 service lifts, provides easy access. It is well-connected, with the sector-76 metro station just 4 km away and close proximity to the Botanical Garden and NSEZ metro stations. Nearby landmarks include Starbucks, Paytm, Haldiram, and Network 18. Parking and valet services are available through Gate No. 1.\n\n📍Find us at Shop No. 1, next to Paytm Office, for your GeniusLabs experience!',
  },
  {
    question: "After the GeniusLabs workshop, what will my child receive?",
    answer:
      "GeniusLabs Innovation Centre is excited to host a workshop for children, offering a rich learning experience with engaging materials. Each participant will receive:\n\n• A folder with a notebook 📔for handwritten notes, essential stationery (pen, pencil, eraser, sharpener).\n• A 3D printed keychain 🎖️ (during the workshop children will also get the chance to explore 3D-printed items from our in-house printer)\n• Every child will be awarded a participation certificate 🎓 to celebrate their achievements.\n• They'll also take home a goodie bag 🎁, a LEGO idea sheet for creative inspiration 📝, and a worksheet for building and operating their own projects.",
  },
  {
    question: "Am I eligible for a discount at GeniusLabs?",
    answer:
      'Currently, GeniusLabs Innovation Centre does not have any discounts available for our workshops. However, we offer a special "Refer & Earn" program that allows you to unlock the chance to earn up to ₹15,000. By referring like-minded parents to our center, which is powered by LEGO Education, you can earn cash rewards. As you invite 1 parent, 3 parents or 5 parents, each referral increases your potential earnings. Keep in mind that while we don\'t have discount schemes at the moment, this referral program provides a great opportunity to benefit from our offerings.\n\n<div class="flex justify-center"><img src="/stemgames/images/refer&earn.png" alt="Refer&Earn" class="responsive-img w-full max-w-[300px] mb-[50px]" /></div>\n\n🚀 Unlock the chance to earn up to ₹15,000 with Genius Labs!🤖\n\nJust refer like-minded parents to our innovation center powered by LEGO Education. Whether you refer to 1, 3, or 5 parents, cash rewards await! 💰',
    images: [],
  },
  {
    question: "Are there any other centers available for GeniusLabs?",
    answer:
      "Unfortunately, there are no other centers available at the moment. But yes, we do plan to open more innovation centers around India and the US.\n\nFor Geniuslabs Location📍: Refer : <a href='#Q7'>Ques 7</a>",
  },
  {
    question: "How is your workshop different from your curriculum?",
    answer:
      "Our workshop is entirely different from our standard curriculum. In the workshops, children participate in interactive sessions that go beyond just learning concepts. They engage with others, enhancing their critical thinking and teamwork skills💡🤝. Kids learn how to collaborate effectively, manage team projects, and apply their creativity in a dynamic environment.\n\nOn the other hand, our curriculum focuses primarily on conceptual learning, emphasizing pure coding and design thinking. It is designed to build a strong theoretical foundation as well as practical, ensuring that students gain a deep understanding of the fundamental principles. While the curriculum is more structured and theory-based, the workshops offer a hands-on, practical approach that fosters interaction and real-world problem-solving.\n\nIn summary:\n\n• <strong>Workshops:</strong> Interactive, team-oriented, focus on critical thinking and practical application.\n• <strong>Curriculum:</strong> Conceptual, and structured, with emphasis on coding and design thinking.",
  },
  {
    question: "Did you arrange the purchase of the Lego Education Kits?",
    answer:
      "Unfortunately, we do not offer Lego Education Kits for purchase at our center.\n\n<div style='overflow: hidden;'><div class='float-left mr-4 mb-4'><img src='/stemgames/images/lego.png' alt='LEGO Education Logo' width='100' height='80' /></div>At GeniusLabs Innovation Centre, we utilize the <strong>LEGO Education SPIKE Essential kits</strong>, which are specifically designed for children aged 6 to 10 years. These kits provide an exciting and interactive learning experience, allowing students to build and explore over 100 engaging projects, including Spirograph designs, Animal Life Cycles, and Arctic Rides. The SPIKE Essential curriculum includes a comprehensive set of 67 lessons, each crafted to foster creativity, problem-solving skills, and hands-on learning. This innovative approach ensures that children not only have fun but also gain valuable educational insights through practical, project-based activities.</div>\n\n<div style='overflow: hidden;'><div class='float-left mr-4 mb-4'><img src='/stemgames/images/lego.png' alt='LEGO Education Logo' width='100' height='80' /></div>At GeniusLabs Innovation Centre, we use the LEGO Education SPIKE Prime kits, which are ideal for children aged 10 and up. These kits offer a rich learning experience with the opportunity to build and explore over 100 innovative projects, such as a Colour Sorter, Smart Bike, and Safe Deposit Box. The SPIKE Prime curriculum comprises 44 thoughtfully designed lessons that encourage advanced problem-solving and critical thinking skills through engaging, hands-on activities. This approach not only enhances students' creativity and technical abilities but also provides a solid foundation in robotics and engineering concepts.</div>",
    images: [],
  },
  {
    question: "Do children need to bring any materials with them when they come to GeniusLabs?",
    answer:
      "You can relax – there's no need to bring anything!\n\n• We provide all the necessary materials for the workshops.\n• Your child might only need a specific snack 🍎 or have dietary restrictions, which you're welcome to prepare if needed. Otherwise, just send them with their excitement and eagerness to learn!",
  },
  {
    question:
      "Can I leave my child at the workshop? Is it a drop-and-leave arrangement? What security measures are in place?",
    answer:
      "<strong>Yes Absolutely</strong>, our workshops have a drop-and-leave option for parents' convenience.\n\n<strong>Check-In and Check-Out Procedure:</strong> When you arrive, our staff will check in your child, and a designated staff member will be responsible for their safety throughout the workshop. At the end of the session, children will only be released to an authorized person listed on the registration form.\n\n<strong>Security Measures:</strong> We have trained staff members and security protocols in place to ensure a safe environment. Our facility is equipped with measures to monitor and manage the children effectively.\n\n<strong>Emergency Contacts:</strong> We will collect emergency contact information during the registration process. If there is a need to reach you, we will contact you immediately. Your child's safety and well-being are our utmost priority.",
  },
  {
    question: "The workshop is 3 hours long. Should we send our child with snacks, or will they be provided?",
    answer:
      "If your child has specific dietary needs or requires a snack during the 3-hour workshop, please send them with a light, non-messy snack and drink. Rest assured, we will also provide snacks if needed.",
  },
  {
    question:
      "Do you have any special programs for children with special needs? Is there a specific curriculum for them?",
    answer:
      "At GeniusLabs Innovation Centre, we are dedicated to creating a supportive and inclusive environment for all children, including those with autism. Our workshops are designed to be engaging for children with a broad range of abilities. We recognize that children with autism may have unique needs and we strive to accommodate them.",
  },
  {
    question: "Are parents allowed to sit during workshops? Is there any waiting area available?",
    answer:
      "• During the workshops, parents are not allowed to stay in the workshop room. This is to ensure that children can fully engage in the activities without distractions.\n• However, we have a designated waiting area 🛋️ where parents can comfortably wait while their child participates in the workshop.\n• Our waiting area is equipped with seating and facilities to make waiting comfortable. If you have any specific concerns or need to reach your child during the workshop, please let us know, and we will ensure that you are promptly contacted if necessary.",
  },
  {
    question: "My child is little less than 4 years. Can I enroll them in the 4-6-year-old Lego-In-Action workshop?",
    answer:
      "Yes. If you observe that your child has the below qualities -\n\n• They have been working with Lego or block material or magnetic tiles and have the attention span to work on a single activity for 15-20 mins. ⏰\n• They love solving puzzles, logical problems or sorting and organizing material.\n• They can listen to guidance and feedback from faculty and are comfortable with students who are older than them.\n\nIf you believe that your child demonstrates these qualities on most days (not all), please enroll them in 4-6 workshops and we are hopeful you will have a great learning experience.",
  },
  {
    question: "What are your hours of operation at GeniusLabs?",
    answer:
      "Our doors are open from 10:00 am to 7:00 pm, seven days a week⏰.\n\n• On days which are declared public holidays and over operations are closed, we send a timely notification to our registered users on their verified numbers.\n• For any questions related to operation hours, directions whatsapp or call us on📱 9468074074.",
  },
  {
    question: "Do you have any upcoming events?",
    answer:
      'Yes, we have a variety of upcoming events, including workshops and field trips. Please visit our <a href="https://geniuslabs.live">Website</a> regularly and subscribe to our social channels on <a href="https://instagram.com/genius_labs.live" target="_blank">Instagram</a> for the latest updates.📅',
  },
  {
    question: "How do Genius Labs teachers communicate with parents?",
    answer:
      "At Genius Labs, we value open communication with parents. Our dedicated teachers regularly connect with parents through phone calls 📞 and parent-teacher conferences to ensure that you are informed about your child's progress. Additionally, we are excited to introduce an online app 📱 that will grant you convenient access to your child's academic journey and you let you track your child's progress.",
  },
  {
    question: "How are the teachers at Genius Labs trained?",
    answer:
      "• Genius Labs teachers receive ongoing training in the latest STEM teaching methods and technologies through multiple online and offline training sessions.\n• They also participate in professional development opportunities to stay up-to-date on the latest research and best practices in STEM education like Lego Quizzes and Lesson plans.",
  },
  {
    question: "What are your program rates at GeniusLabs?",
    answer: "Our program rates vary depending on the program and age group level.",
  },
  {
    question: "What subjects do you teach at GeniusLabs?",
    answer:
      "At GeniusLabs, we focus on a variety of STEM subjects:\n\n• <strong>Math:</strong> From basic arithmetic to problem-solving skills, we make math fun and engaging through hands-on activities.\n• <strong>Science:</strong> We explore key scientific concepts, helping kids understand how the world around them works through experiments and exploration.🔬\n• <strong>Technology:</strong> Children learn about coding, robotics🤖, and how technology can be used to solve real-world problems.\n• <strong>Engineering:</strong> Through building projects, we teach the fundamentals of design, construction, and innovation, fostering creativity and critical thinking.🔩",
  },
  {
    question: "What are the qualifications of the teachers at GeniusLabs?",
    answer:
      "GeniusLabs Innovation Centre has a highly formalized process of hiring and training the faculty in our centers. Minimum - Educational qualifications:\n\n1. Our faculty is required to have their 10th percentage - 85% and above and 12th percentage of PCM 85% and above.\n2. They are required to be qualified as engineers or as scientists and need to have formal 4 year graduation of 4 year post graduation in STEM fields.\n3. They need to complete the education post school from a reputed deemed university. Few of our faculty members are graduates from IIT-IIM.\n4. Along with this they have to complete a rigorous training program at GeniusLabs, before they start interacting with students.",
  },
  {
    question: "How are GeniusLabs innovation centers (physical) better than online classes?",
    answer:
      "GeniusLabs Innovation Centre stands out from online robotics classes in several key ways:\n\n1. <strong>Hands-On Learning:</strong> GeniusLabs offers offline, hands-on experiences with 40+ Lego Education practical learning kits like:- Lego spike prime, Lego spike essential, Simple and powered machine, Mindstorms EV3, iRoot Robot and many more. This high quality, interactive approach allows students to build and experiment with physical components, enhancing their understanding of robotics and engineering concepts in a way that online classes may not fully replicate.\n2. <strong>Curriculum Depth:</strong> With over 1000 hours of STEM-focused curriculum on Robotic development and programming, Physics concept via science project, Coding and game development, product design and innovation, including worksheets and missions, GeniusLabs offers a comprehensive and immersive educational journey. The curriculum is designed to align with NEP 2020 and is backed by extensive research and faculty expertise.\n3. <strong>Qualified Faculty:</strong> All faculty members are highly qualified, holding BTech or Masters in relevant fields from esteemed institutions, and the founder is an IIT Roorkee alumnus. This level of expertise contributes to a richer, more informed learning experience compared to many online programs. Robotics and STEM Qualified Faculty.\n4. <strong>Peer Interaction:</strong> Offline classes provide opportunities for students to interact with peers, collaborate on projects, and engage in group activities. This social aspect is often less emphasized in online settings but is crucial for developing teamwork and communication skills.\n5. <strong>Focused Learning Environment:</strong> The physical classroom setting minimizes distractions that can be prevalent in home environments, allowing students to immerse themselves fully in their projects and activities and also providing the experimental worksheet, homesheet and flash card.\n\nOverall, GeniusLabs offers a robust, interactive, and professionally guided learning experience that distinguishes it from online robotics classes.",
  },
]

function processLinks(text: string) {
  // First process special ENROL NOW links with button styling
  const processedEnrolLinks = text.replace(
    /ENROL NOW/g,
    '<span class="inline-block px-4 py-2 bg-[#00b2ff] text-white rounded-md hover:bg-[#0099e6] transition-colors">ENROL NOW</span>',
  )

  // Then process regular links
  const processedLinks = processedEnrolLinks.replace(
    /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1(?:\s+(?:[^>]*?\s+)?target=(["'])(.*?)\3)?[^>]*>(.*?)<\/a>/g,
    (_, __, href, ___, target, content) => {
      // Check if it's an internal question reference
      if (href.startsWith("#Q")) {
        const questionNumber = Number.parseInt(href.replace("#Q", ""))
        return `<a href="javascript:void(0)" onclick="window.handleQuestionClick(${questionNumber - 1})" class="text-[#00b2ff] hover:underline">${content}</a>`
      }
      // For external links, add target="_blank"
      const targetAttr = ` target="_blank" rel="noopener noreferrer"`
      if (content.includes('class="inline-block px-4')) {
        // If it's our button, wrap it in a link without changing its styling
        return `<a href="${href}"${targetAttr}>${content}</a>`
      }
      return `<a href="${href}" class="text-[#00b2ff] hover:underline"${targetAttr}>${content}</a>`
    },
  )

  // Process phone numbers into clickable links with tel: protocol
  const processedPhoneNumbers = processedLinks.replace(
    /(\d{10})/g,
    '<a href="tel:$1" class="text-[#00b2ff] hover:underline">$1</a>',
  )

  // Then process bullet points and numbered points with indentation
  const processedBullets = processedPhoneNumbers.replace(/•\s+(.*?)(?=<br\/>|$)/g, '<div class="pl-4">• $1</div>')

  // Finally process numbered points
  return processedBullets.replace(/(\d+\.)\s+(.*?)(?=<br\/>|$)/g, '<div class="pl-4">$1 $2</div>')
}

function FAQItemRenderer({
  question,
  answer,
  delay,
  index,
  images,
  onOpen,
}: FAQItem & {
  delay: number
  index: number
  onOpen: (index: number) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : "0px"
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      onOpen(index)
    }
  }

  const renderImages = () => {
    if (!images || images.length === 0) return null

    if (images.some((img) => img.float)) {
      return images.map((img, index) => (
        <div key={index} className="float-left m-5 pl-[50px]">
          <Image src={img.src || "/placeholder.svg"} alt={img.alt} width={img.width || 100} height={img.height || 80} />
        </div>
      ))
    }

    return (
      <div className="flex flex-col items-center py-10">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img.src || "/placeholder.svg"}
            alt={img.alt}
            width={img.width || 300}
            height={img.height || 200}
            className={`w-full max-w-[300px] mb-[50px] ${img.className || ""}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      id={`Q${index + 1}`}
      className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-in-out hover:shadow-md ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <button
        className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <span className="text-[#00b2ff] mr-2 font-medium">Q{index + 1}.</span>
          <span className="text-sm font-medium text-[#0b5394]">{question}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: "0px" }}
      >
        <div className="px-4 py-3">
          <div
            className="text-xs text-[#0b5394] space-y-2"
            dangerouslySetInnerHTML={{
              __html: processLinks(answer.replace(/\n/g, "<br/>")),
            }}
          />
          {renderImages()}
        </div>
      </div>
    </div>
  )
}

export default function FAQComponent() {
  const [visibleCount, setVisibleCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const navigateToQuestion = useCallback(
    (index: number) => {
      // Ensure the question is visible
      setVisibleCount(Math.max(visibleCount, index + 1))

      // Scroll to the question
      setTimeout(() => {
        const element = document.getElementById(`Q${index + 1}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    },
    [visibleCount],
  )

  // Add global handler for question clicks
  useEffect(() => {
    window.handleQuestionClick = navigateToQuestion
    return () => {
      if ("handleQuestionClick" in window) {
        window.handleQuestionClick = undefined
      }
    }
  }, [navigateToQuestion])

  const showMoreQuestions = () => {
    setIsLoading(true)
    setVisibleCount((prev) => {
      const newCount = Math.min(prev + 5, faqData.length)
      setIsLoading(false)
      return newCount
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-lg xxs:text-base font-bold text-[#073763] text-left mb-6">Frequently Asked Questions by Genius Parents </h1>

      <div className="space-y-3">
        {faqData.slice(0, visibleCount).map((faq, index) => (
          <FAQItemRenderer
            key={index}
            question={faq.question}
            answer={faq.answer}
            images={faq.images}
            delay={index < 5 ? 0 : (index % 5) * 300}
            index={index}
            onOpen={navigateToQuestion}
          />
        ))}
      </div>

      {visibleCount < faqData.length && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={showMoreQuestions} className="px-6 py-2 text-sm" disabled={isLoading}>
            {isLoading ? "Loading..." : "Learn More"}
          </Button>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window {
    handleQuestionClick?: (index: number) => void
  }
}

