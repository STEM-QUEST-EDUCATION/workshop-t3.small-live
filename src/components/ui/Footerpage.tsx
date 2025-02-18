import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footerpage() {
  return (
    <footer className="bg-blue-400
     text-white px-4 pt-4 pb-16 mt-10">
      <div className="max-w-md mx-auto space-y-4">
        {/* Logo */}
        <div className="w-48">
          <Link href="https://www.geniuslabs.live/" target="_blank" rel="noopener noreferrer">
            <Image src="/LOGO.png" alt="Genius Labs Logo" width={150} height={50} className="rounded-md" />
          </Link>
        </div>

        {/* Description */}
        <div className="space-y-2 text-[14px]">
          <p>
            Welcome to Genius Labs
          </p>
          <p>STEM Quest Education Private Ltd is a company</p>
        </div>

        {/* Line */}
        <hr className="border-t border-white" />

        {/* Links Section */}
        <div className="flex flex-row gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-base">GENIUSLABS</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="https://www.geniuslabs.live/index.html" target="_blank" rel="noopener noreferrer">Home</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stemgames.html" target="_blank" rel="noopener noreferrer">STEM Games</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stem-brilliance-program.html" target="_blank" rel="noopener noreferrer">STEM Brilliance Programs</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stem-refund-policy.html" target="_blank" rel="noopener noreferrer">Refund Policy</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stem-privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stem-terms-and-condition.html" target="_blank" rel="noopener noreferrer">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base">STEM World</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stemgameinfopage/kidsstemgames_balloonmath.html" target="_blank" rel="noopener noreferrer">Balloon Math</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stemgameinfopage/kidsstemgames_canyouguessanimals.html" target="_blank" rel="noopener noreferrer">Can You Guess?</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stemgameinfopage/kidsstemgames_sciencecitychemistry.html" target="_blank" rel="noopener noreferrer">Science City</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/stemgameinfopage/kidsstemgames_healthysnake.html" target="_blank" rel="noopener noreferrer">Healthy Snake</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/SBP_STEMcuriouskids_7to10yrs_curriculumdetails.html" target="_blank" rel="noopener noreferrer">STEM Curious Kids 7-10 Yrs</Link>
              </li>
              <li>
                <Link href="https://www.geniuslabs.live/stemgames/SBP_STEMcuriouskids_8to11yrs_curriculumdetails.html" target="_blank" rel="noopener noreferrer">Stem Curious Kids 8-11 Yrs</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-1.5 text-sm">
          <p>
            Email us at <a href="mailto:info@geniuslabs.live" target="_blank" rel="noopener noreferrer">info@geniuslabs.live</a>
          </p>
          <p>
            Call us at <a href="tel:+919468074074" target="_blank" rel="noopener noreferrer">+91 9468074074</a>
          </p>
          <p>
            Visit us at <a href="https://www.google.com/maps/dir//SkymarkOne+Ground+Floor,+OFFICE,+next+to+Paytm,+Sector+98,+Noida,+Uttar+Pradesh+201303/@28.5319061,77.2789364,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390ce7c3064968ab:0x129af5297a9866b7!2m2!1d77.3613378!2d28.531931?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%D" target="_blank" rel="noopener noreferrer">SkymarkOne, Sector-98, Noida, Uttar Pradesh</a>
          </p>
        </div>

        {/* Line */}
        <hr className="border-t border-white" />

        {/* Social Media */}
        <div className="space-y-2">
          <h3 className="text-xl">Follow us on:</h3>
          <div className="flex gap-4">
            <Link href="https://www.instagram.com/genius_labs.live/" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <Instagram className="w-6 h-6 text-pink-400" />
            </Link>
            <Link href="https://business.facebook.com/latest/home?business_id=1276543033268313&asset_id=119011211298580" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <Facebook className="w-6 h-6 text-pink-400" />
            </Link>
            <Link href="https://www.linkedin.com/in/genius-labs-4736ab286/" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <Linkedin className="w-6 h-6 text-pink-400" />
            </Link>
            <Link href="https://www.youtube.com/@GeniusLabsWorkshops" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <Youtube className="w-6 h-6 text-pink-400" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}