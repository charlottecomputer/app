import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"

export default function TodayPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <Icon icon="calendar" className="w-8 h-8 text-muted-foreground" />
        </div>
        <Text variant="bold" className="text-2xl">Today</Text>
        <Text variant="medium" className="text-lg">Welcome to your Today view</Text>
        <Text variant="regular" className="text-muted-foreground">See everything due today across all your projects.</Text>
      </div>
      <Button>
        <Icon icon="plus" className="mr-2" />
        Add task
      </Button>
    </div>
  )
}
