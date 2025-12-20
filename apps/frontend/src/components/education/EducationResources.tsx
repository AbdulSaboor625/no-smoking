import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Resource {
  id: number
  title: string
  subtitle: string
  materialsCount: number
  topicHeading: string
  description: string
  status: string
}

const EducationResources = () => {
  // Sample data for Active Resources
  const activeResources: Resource[] = [
    {
      id: 1,
      title: 'Understanding Addiction',
      subtitle: 'How nicotine affects your brain',
      materialsCount: 10,
      topicHeading: 'How Nicotine Works',
      description: 'Nicotine is a highly addictive substance that affects your brain\'s reward system. When you use nicotine, it triggers the release of dopamine - a "feel-good" chemical.',
      status: 'Not Started'
    },
    {
      id: 2,
      title: 'Withdrawal Timeline',
      subtitle: 'What to expect and when',
      materialsCount: 8,
      topicHeading: 'First 24 Hours',
      description: 'Strong cravings, irritability, anxiety, difficulty concentrating. Stay busy, drink water, avoid triggers during this critical period.',
      status: 'Not Started'
    },
    {
      id: 3,
      title: 'Coping Strategies',
      subtitle: 'Tools to help you succeed',
      materialsCount: 12,
      topicHeading: 'The 4 D\'s',
      description: 'Delay, Distract, Deep Breathe, and Drink Water. These four strategies form your emergency toolkit when cravings strike.',
      status: 'Not Started'
    },
    {
      id: 4,
      title: 'Health Benefits',
      subtitle: 'Your body\'s recovery timeline',
      materialsCount: 15,
      topicHeading: 'Immediate Benefits',
      description: 'Within 20 minutes, your heart rate and blood pressure drop. Within 12 hours, carbon monoxide levels normalize.',
      status: 'Not Started'
    },
    {
      id: 5,
      title: 'Tips for Success',
      subtitle: 'Strategies for common situations',
      materialsCount: 9,
      topicHeading: 'After Meals',
      description: 'Brush teeth immediately, go for a short walk, chew sugar-free gum, or have a healthy dessert ready to break the habit.',
      status: 'Not Started'
    },
    {
      id: 6,
      title: 'Breaking Automatic Behavior',
      subtitle: 'The autopilot loop',
      materialsCount: 7,
      topicHeading: 'How Triggers Control You',
      description: 'Understanding how triggers create automatic responses is the first step to breaking free from the addiction cycle.',
      status: 'Not Started'
    },
    {
      id: 7,
      title: 'Preparing for Quit Day',
      subtitle: 'What to expect',
      materialsCount: 11,
      topicHeading: 'The 5-Minute Rule',
      description: 'Cravings peak and pass in approximately 5 minutes. Learning to ride them out is a crucial skill for success.',
      status: 'Not Started'
    },
    {
      id: 8,
      title: 'Becoming a Non-Smoker',
      subtitle: 'Identity shift',
      materialsCount: 13,
      topicHeading: 'How Non-Smokers Think',
      description: 'The mental shift from "I\'m trying to quit" to "I am a non-smoker" is powerful and transformative.',
      status: 'Not Started'
    }
  ]

  // Sample data for other tabs
  const completedResources: Resource[] = Array.from({ length: 24 }, (_, i) => ({
    ...activeResources[i % activeResources.length],
    id: i + 1,
    status: 'Completed'
  }))

  const upcomingResources: Resource[] = Array.from({ length: 3 }, (_, i) => ({
    ...activeResources[i % activeResources.length],
    id: i + 1,
    status: 'Upcoming'
  }))

  const pausedResources: Resource[] = Array.from({ length: 7 }, (_, i) => ({
    ...activeResources[i % activeResources.length],
    id: i + 1,
    status: 'Paused'
  }))

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className="border border-[#e2e2e2] rounded-xl flex flex-col hover:shadow-md transition-shadow bg-white h-full">
      {/* Title Section with Materials Tag */}
      <div className="flex items-start justify-between gap-3 bg-[#F2F2F2] p-5 rounded-t-xl flex-shrink-0 min-h-[100px]">
        <div className="flex-1 min-w-0">
          <h3 className="2xl:text-xl text-lg font-semibold text-[#561F7A] mb-1 line-clamp-2">{resource.title}</h3>
          <p className="text-sm font-normal text-[#561F7A] line-clamp-1">{resource.subtitle}</p>
        </div>
        <div className="bg-[#F5B600] rounded-[4px] px-2 py-[3px] flex-shrink-0">
          <span className="text-xs font-normal text-[#612F8D] block">
            {resource.materialsCount} Materials
          </span>
        </div>  
      </div>
      <div className="p-5 flex flex-col justify-between flex-1 bg-white rounded-b-xl min-h-0">
        {/* Topic Heading & Description */}
        <div className="flex-1 min-h-0">
          <h4 className="text-base font-semibold text-[#561F7A] mb-2">{resource.topicHeading}</h4>
          <p className="text-xs font-normal text-[#000] leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        </div>

        {/* Status */}
        <div className="pt-2 flex-shrink-0">
          <span className="text-base font-semibold text-[#000000]">{resource.status}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-white rounded-2xl p-6 mb-8">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full flex-wrap justify-start bg-transparent md:border-b border-[#E5E5E5] rounded-none p-0 h-auto md:gap-8 gap-4 mb-6">
          <TabsTrigger
            value="active"
            className="px-0 md:py-3 py-1 !bg-transparent !active:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-[#612F8D] data-[state=active]:text-[#612F8D] text-[#561F7A] font-semibold md:text-base text-xs data-[state=active]:bg-transparent !shadow-none !active:shadow-none"
          >
            Active Resources (08)
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="px-0 md:py-3 py-1 !bg-transparent !active:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-[#612F8D] data-[state=active]:text-[#612F8D] text-[#561F7A] font-semibold md:text-base text-xs data-[state=active]:bg-transparent !shadow-none !active:shadow-none"
          >
            Completed (24)
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="px-0 md:py-3 py-1 !bg-transparent !active:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-[#612F8D] data-[state=active]:text-[#612F8D] text-[#561F7A] font-semibold md:text-base text-xs data-[state=active]:bg-transparent !shadow-none !active:shadow-none"
          >
            Upcoming Resources ( 03 )
          </TabsTrigger>
          <TabsTrigger
            value="paused"
            className="px-0 md:py-3 py-1 !bg-transparent !active:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-[#612F8D] data-[state=active]:text-[#612F8D] text-[#561F7A] font-semibold md:text-base text-xs data-[state=active]:bg-transparent !shadow-none !active:shadow-none"
          >
            Paused ( 07 )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
            {activeResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} /> 
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
            {completedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
            {upcomingResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paused" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
            {pausedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EducationResources