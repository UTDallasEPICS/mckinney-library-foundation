// server/data/mockData.js

// Mock donations data
export const mockDonations = [
    { id: 1, donor: 'John Smith', amount: 100, date: '2025-03-01', category: 'Books', status: 'Received', boardMember: false },
    { id: 2, donor: 'Jane Doe', amount: 250, date: '2025-03-05', category: 'Programs', status: 'Received', boardMember: true },
    { id: 3, donor: 'Bob Johnson', amount: 500, date: '2025-03-10', category: 'Technology', status: 'Received', boardMember: false }
];

// Mock grants data
export const mockGrants = [
    {
        id: 1,
        name: 'Community Literacy',
        amount: 5000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'Active',
        notes: 'Annual literacy program funding',
        boardMember: true,
        link: 'https://example.com/grants/community-literacy'
    },
    {
        id: 2,
        name: 'Technology Fund',
        amount: 7500,
        startDate: '2025-02-15',
        endDate: '2025-08-15',
        status: 'Pending',
        notes: 'Awaiting final approval',
        boardMember: false,
        link: null
    },
    {
        id: 3,
        name: 'Children\'s Reading Program',
        amount: 3200,
        startDate: '2025-03-01',
        endDate: '2025-06-30',
        status: 'Active',
        notes: 'Summer reading initiative',
        boardMember: true,
        link: 'https://example.com/grants/childrens-reading'
    }
];