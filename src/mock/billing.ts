export const creditPlans = [
    {
        id: 'starter',
        name: 'Starter Pack',
        amount: 2500,
        credits: 100,
        description: 'Perfect for trying out our AI models',
        popular: false,
        bonus: 0,
    },
    {
        id: 'developer',
        name: 'Developer Pack',
        amount: 12500,
        credits: 500,
        description: 'Great for regular development work',
        popular: true,
        bonus: 50,
    },
    {
        id: 'enterprise',
        name: 'Enterprise Pack',
        amount: 50000,
        credits: 2000,
        description: 'For large scale applications',
        popular: false,
        bonus: 400,
    },
]


export const creditHistory = [
    {
        date: 'Dec 15, 2024',
        type: 'Purchase',
        amount: '+₦50,000',
        credits: '+6,000',
        status: 'Completed',
    },
    {
        date: 'Dec 10, 2024',
        type: 'Usage',
        amount: '-₦12,500',
        credits: '-1,250',
        status: 'Processed',
    },
    {
        date: 'Dec 8, 2024',
        type: 'Purchase',
        amount: '+₦25,000',
        credits: '+2,500',
        status: 'Completed',
    },
    {
        date: 'Dec 5, 2024',
        type: 'Usage',
        amount: '-₦8,750',
        credits: '-875',
        status: 'Processed',
    },
    {
        date: 'Dec 1, 2024',
        type: 'Purchase',
        amount: '+₦100,000',
        credits: '+12,000',
        status: 'Completed',
    },
]
export const stats = [
    {
        key: 'available_balance',
        title: 'Available Balance',
        value: '₦247,500',
        subtext: '≈ 24,750 tokens remaining',
        status: 'Active',
        type: 'balance',
    },
    {
        key: 'monthly_usage',
        title: 'Monthly Usage',
        value: '₦89,400',
        maxValue: '₦200,000',
        percent: 44.7,
        subtext: '44.7% of monthly budget used',
        type: 'usage',
    },
    {
        key: 'total_credits_used',
        title: 'Total Credits Used',
        value: '8,950',
        subtext: '≈ ₦223,750 worth of credits',
        type: 'summary',
    },
]