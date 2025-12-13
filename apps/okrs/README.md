# OKRs Application

This is an OKR application it will update the user using Redux.

OKR has:

objectives: {
    startDate: Date,
    endDate: Date,
    title: string,
    description: string,
    keyResults: KEYRESULT[]
    
}

keyResult: {
    title: string,
    target: number, (amount of taps user does to complete target)
    targetTapLabel: string, 
    icon: string,
    recurring: everyday | weekly | monthly | yearly | Mon, Tue, Wed, Thu, Fri, Sat, Sun.. at 13:00... some logic here that keeps recurring date and time, or it could be one time.
    the key result taps reset whenever the recurring date and time is reached, and the user can enter taps for that day/week.... these taps need logging for long term tracking.
    
}