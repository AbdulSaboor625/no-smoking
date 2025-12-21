import { ThumbsUp, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EducationDetails = () => {
  return (
    <div className="w-full bg-[#561F7A] lg:rounded-2xl md:rounded-xl rounded-lg md:px-6 px-4 md:py-10 py-6 flex items-center 2xl:gap-12 xl:gap-8 gap-6 flex-wrap lg:flex-nowrap">
      <div className="flex items-center gap-4 group">
        <div className="lg:w-[65px] lg:h-[65px] w-[50px] h-[50px] rounded-full bg-white border-[#612F8D] group-hover:bg-[#fff]/60 transition-all duration-300 flex items-center justify-center flex-shrink-0">
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:stroke-[#fff]/80 transition-all duration-300">
            <path d="M10.3501 17.55V5.55001C10.3501 3.28726 10.3501 2.15589 9.64714 1.45295C8.9442 0.75 7.81283 0.75 5.55007 0.75C3.28733 0.75 2.15596 0.75 1.45301 1.45294C0.750072 2.15589 0.75006 3.28725 0.750048 5.54998L0.75 17.55C0.749988 19.8128 0.749988 20.9441 1.45293 21.6471C2.15587 22.35 3.28726 22.35 5.55004 22.35C7.81282 22.35 8.9442 22.35 9.64714 21.6471C10.3501 20.9441 10.3501 19.8128 10.3501 17.55Z" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.0972 16.0011L21.207 5.78089C20.6367 3.76418 20.3514 2.75582 19.5708 2.26424C19.5077 2.22453 19.4429 2.18775 19.3764 2.15403C18.5532 1.73658 17.5355 2.00649 15.5002 2.54628C13.4137 3.09959 12.3706 3.37625 11.8661 4.16706C11.8254 4.23084 11.7879 4.29649 11.7534 4.36381C11.3263 5.19841 11.6187 6.23204 12.2033 8.29929L15.0935 18.5196C15.6639 20.5363 15.9491 21.5447 16.7297 22.0362C16.7928 22.0759 16.8576 22.1126 16.9241 22.1464C17.7473 22.5638 18.765 22.294 20.8004 21.7542C22.8868 21.2009 23.93 20.9241 24.4344 20.1333C24.4751 20.0696 24.5127 20.004 24.5471 19.9367C24.9742 19.1021 24.6819 18.0684 24.0972 16.0011Z" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5498 17.5503H5.56058" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M0.75 5.5498H10.35" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.9395 17.554L19.9499 17.5513" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.75 7.95004L21.15 5.5498" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-white leading-tight mb-2">Active Resources</span>
          <span className="lg:text-[30px] text-xl lg:font-semibold font-semibold text-white leading-tight">16</span>
        </div>
      </div>

      <div className="flex items-center gap-4 group">
        <div className="lg:w-[65px] lg:h-[65px] w-[50px] h-[50px] rounded-full bg-white border-[#612F8D] group-hover:bg-[#fff]/60 transition-all duration-300 flex items-center justify-center flex-shrink-0">
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:stroke-[#fff]/80 transition-all duration-300">
          <path d="M0.75 11.25C0.75 6.30026 0.75 3.82538 2.28769 2.28769C3.82538 0.75 6.30026 0.75 11.25 0.75C16.1997 0.75 18.6746 0.75 20.2124 2.28769C21.75 3.82538 21.75 6.30026 21.75 11.25C21.75 16.1997 21.75 18.6746 20.2124 20.2124C18.6746 21.75 16.1997 21.75 11.25 21.75C6.30026 21.75 3.82538 21.75 2.28769 20.2124C0.75 18.6746 0.75 16.1997 0.75 11.25Z" stroke="#561F7A" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M12.2047 6.52174L13.1772 8.48286C13.3098 8.75586 13.6635 9.01771 13.9618 9.06783L15.7246 9.36316C16.8519 9.5526 17.117 10.3771 16.3048 11.1905L14.9343 12.5723C14.7024 12.8063 14.5752 13.2576 14.6471 13.5806L15.0393 15.291C15.3488 16.645 14.636 17.1686 13.448 16.461L11.7958 15.4749C11.4974 15.2967 11.0056 15.2967 10.7017 15.4749L9.04951 16.461C7.86702 17.1686 7.14867 16.6393 7.45811 15.291L7.85044 13.5806C7.92228 13.2576 7.79518 12.8063 7.5631 12.5723L6.19273 11.1905C5.38598 10.3771 5.64568 9.5526 6.77293 9.36316L8.53563 9.06783C8.8285 9.01771 9.18214 8.75586 9.31476 8.48286L10.2873 6.52174C10.8178 5.4576 11.6798 5.4576 12.2047 6.52174Z" stroke="#561F7A" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-white leading-tight mb-2">Participation Rate</span>
          <span className="lg:text-[30px] text-xl lg:font-semibold font-semibold text-white leading-tight">97%</span>
        </div>
      </div>

      <div className="flex items-center gap-4 group">
        <div className="lg:w-[65px] lg:h-[65px] w-[50px] h-[50px] rounded-full bg-white border-[#612F8D] group-hover:bg-[#fff]/60 transition-all duration-300 flex items-center justify-center flex-shrink-0">
          <ThumbsUp className="w-6 h-6 text-[#612F8D] stroke-2" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-normal text-white/90 leading-tight mb-2">Satisfactory Level</span>
          <span className="lg:text-2xl text-lg lg:font-bold font-semibold text-white leading-tight">Satisfied</span>
        </div>
      </div>

      {/* Update Resources Button */}
      <Button
        variant="outline"
        className="rounded-[10px] lg:px-4 px-3 lg:py-2.5 py-2 lg:h-[65px] h-[50px] border border-white text-white bg-transparent hover:bg-white/40 hover:text-white hover:border-white flex items-center gap-3 font-semibold ml-auto"
      >
        <div className="w-5 h-5 rounded border-2 border-white flex items-center justify-center">
          <Plus className="w-full h-full" strokeWidth={2.5} />
        </div>
        <span className="lg:text-xl md:text-base text-sm lg:leading-tight leading-normal font-normal lg:font-semibold">Update Resources</span>
      </Button>
    </div>
  )
}

export default EducationDetails