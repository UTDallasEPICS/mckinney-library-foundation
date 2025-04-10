// server/data/mockData.js

// Mock donors data
export const mockDonors = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(214) 555-1234',
        address: '123 Main St, McKinney, TX 75069',
        totalDonations: 650,
        lastDonationDate: '2025-03-01',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '(214) 555-5678',
        address: '456 Oak Ave, McKinney, TX 75070',
        totalDonations: 1200,
        lastDonationDate: '2025-03-05',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '(214) 555-9012',
        address: '789 Pine Blvd, McKinney, TX 75071',
        totalDonations: 500,
        lastDonationDate: '2025-03-10',
        status: 'Active'
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        phone: '(214) 555-3456',
        address: '101 Cedar Ln, McKinney, TX 75072',
        totalDonations: 2000,
        lastDonationDate: '2025-02-15',
        status: 'Inactive'
    },
    {
        id: 5,
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '(214) 555-7890',
        address: '202 Elm St, McKinney, TX 75069',
        totalDonations: 3500,
        lastDonationDate: '2025-02-28',
        status: 'Active'
    }
];

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