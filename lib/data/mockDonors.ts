/**
 * Mock donor gift dataset — 60 rows simulating a realistic nonprofit gift history.
 *
 * Swap this import for real Supabase queries when connecting the live database.
 * All calculations (KPIs, charts) use the same DonorGift type regardless of data source.
 */

export interface DonorGift {
  donor_id: string;
  donor_name: string;
  segment: string;
  gift_date: string; // ISO date: YYYY-MM-DD
  gift_amount: number;
  campaign: string;
  channel: string;
  region: string;
}

export const mockDonors: DonorGift[] = [
  // --- Year-End Appeal (Nov–Dec 2023) ---
  { donor_id: 'D001', donor_name: 'Eleanor Hartman', segment: 'Major Gifts', gift_date: '2023-11-05', gift_amount: 5000, campaign: 'Year-End Appeal', channel: 'Direct Mail', region: 'Midwest' },
  { donor_id: 'D002', donor_name: 'Franklin Cho', segment: 'Mid-Level', gift_date: '2023-11-12', gift_amount: 500, campaign: 'Year-End Appeal', channel: 'Email', region: 'Northeast' },
  { donor_id: 'D003', donor_name: 'Susan Nakamura', segment: 'Sustainer', gift_date: '2023-11-01', gift_amount: 25, campaign: 'Year-End Appeal', channel: 'Online', region: 'West' },
  { donor_id: 'D004', donor_name: 'James Okafor', segment: 'First-Time', gift_date: '2023-11-20', gift_amount: 100, campaign: 'Year-End Appeal', channel: 'Online', region: 'South' },
  { donor_id: 'D005', donor_name: 'Maria Santos', segment: 'Major Gifts', gift_date: '2023-12-02', gift_amount: 7500, campaign: 'Year-End Appeal', channel: 'Event', region: 'Northeast' },
  { donor_id: 'D006', donor_name: 'Robert Kline', segment: 'Lapsed', gift_date: '2023-12-05', gift_amount: 250, campaign: 'Year-End Appeal', channel: 'Direct Mail', region: 'Midwest' },
  { donor_id: 'D007', donor_name: 'Patricia Webb', segment: 'Mid-Level', gift_date: '2023-12-10', gift_amount: 750, campaign: 'Year-End Appeal', channel: 'Phone', region: 'South' },
  { donor_id: 'D008', donor_name: 'David Nguyen', segment: 'General', gift_date: '2023-12-14', gift_amount: 50, campaign: 'Year-End Appeal', channel: 'Email', region: 'West' },
  { donor_id: 'D009', donor_name: 'Linda Freeman', segment: 'Sustainer', gift_date: '2023-12-01', gift_amount: 25, campaign: 'Year-End Appeal', channel: 'Online', region: 'Midwest' },
  { donor_id: 'D010', donor_name: 'Michael Torres', segment: 'Major Gifts', gift_date: '2023-12-20', gift_amount: 10000, campaign: 'Year-End Appeal', channel: 'Direct Mail', region: 'Northeast' },

  // --- Spring Drive (Mar–Apr 2024) ---
  { donor_id: 'D011', donor_name: 'Jennifer Park', segment: 'Mid-Level', gift_date: '2024-03-05', gift_amount: 600, campaign: 'Spring Drive', channel: 'Email', region: 'West' },
  { donor_id: 'D012', donor_name: 'Christopher Hall', segment: 'First-Time', gift_date: '2024-03-08', gift_amount: 75, campaign: 'Spring Drive', channel: 'Online', region: 'South' },
  { donor_id: 'D013', donor_name: 'Amanda Lewis', segment: 'Sustainer', gift_date: '2024-03-01', gift_amount: 25, campaign: 'Spring Drive', channel: 'Online', region: 'Midwest' },
  { donor_id: 'D014', donor_name: 'Kevin Martinez', segment: 'General', gift_date: '2024-03-15', gift_amount: 35, campaign: 'Spring Drive', channel: 'Email', region: 'Northeast' },
  { donor_id: 'D015', donor_name: 'Eleanor Hartman', segment: 'Major Gifts', gift_date: '2024-03-22', gift_amount: 2500, campaign: 'Spring Drive', channel: 'Phone', region: 'Midwest' },
  { donor_id: 'D016', donor_name: 'Stephanie Young', segment: 'Lapsed', gift_date: '2024-04-01', gift_amount: 150, campaign: 'Spring Drive', channel: 'Direct Mail', region: 'West' },
  { donor_id: 'D017', donor_name: 'Brian Wilson', segment: 'Major Gifts', gift_date: '2024-04-03', gift_amount: 3000, campaign: 'Spring Drive', channel: 'Event', region: 'Northeast' },
  { donor_id: 'D018', donor_name: 'Carol Adams', segment: 'Mid-Level', gift_date: '2024-04-07', gift_amount: 400, campaign: 'Spring Drive', channel: 'Email', region: 'South' },
  { donor_id: 'D019', donor_name: 'Ryan Thompson', segment: 'First-Time', gift_date: '2024-04-10', gift_amount: 50, campaign: 'Spring Drive', channel: 'Online', region: 'Midwest' },
  { donor_id: 'D020', donor_name: 'Deborah Clark', segment: 'Sustainer', gift_date: '2024-04-01', gift_amount: 25, campaign: 'Spring Drive', channel: 'Online', region: 'West' },

  // --- Capital Campaign (May–Aug 2024) ---
  { donor_id: 'D005', donor_name: 'Maria Santos', segment: 'Major Gifts', gift_date: '2024-05-10', gift_amount: 25000, campaign: 'Capital Campaign', channel: 'Event', region: 'Northeast' },
  { donor_id: 'D010', donor_name: 'Michael Torres', segment: 'Major Gifts', gift_date: '2024-05-15', gift_amount: 20000, campaign: 'Capital Campaign', channel: 'Direct Mail', region: 'Northeast' },
  { donor_id: 'D021', donor_name: 'Dorothy Green', segment: 'Major Gifts', gift_date: '2024-05-20', gift_amount: 15000, campaign: 'Capital Campaign', channel: 'Event', region: 'South' },
  { donor_id: 'D022', donor_name: 'Paul Baker', segment: 'Mid-Level', gift_date: '2024-06-01', gift_amount: 1000, campaign: 'Capital Campaign', channel: 'Phone', region: 'Midwest' },
  { donor_id: 'D023', donor_name: 'Sandra Robinson', segment: 'Mid-Level', gift_date: '2024-06-08', gift_amount: 850, campaign: 'Capital Campaign', channel: 'Email', region: 'West' },
  { donor_id: 'D001', donor_name: 'Eleanor Hartman', segment: 'Major Gifts', gift_date: '2024-06-12', gift_amount: 10000, campaign: 'Capital Campaign', channel: 'Event', region: 'Midwest' },
  { donor_id: 'D024', donor_name: 'Charles Mitchell', segment: 'First-Time', gift_date: '2024-06-20', gift_amount: 200, campaign: 'Capital Campaign', channel: 'Online', region: 'South' },
  { donor_id: 'D025', donor_name: 'Helen Carter', segment: 'Sustainer', gift_date: '2024-07-01', gift_amount: 25, campaign: 'Capital Campaign', channel: 'Online', region: 'Northeast' },
  { donor_id: 'D026', donor_name: 'Thomas Perez', segment: 'Lapsed', gift_date: '2024-07-05', gift_amount: 300, campaign: 'Capital Campaign', channel: 'Direct Mail', region: 'Midwest' },
  { donor_id: 'D027', donor_name: 'Nancy Harris', segment: 'General', gift_date: '2024-07-10', gift_amount: 75, campaign: 'Capital Campaign', channel: 'Email', region: 'West' },
  { donor_id: 'D028', donor_name: 'Mark Davis', segment: 'Mid-Level', gift_date: '2024-07-18', gift_amount: 500, campaign: 'Capital Campaign', channel: 'Phone', region: 'South' },
  { donor_id: 'D029', donor_name: 'Barbara Garcia', segment: 'Major Gifts', gift_date: '2024-08-02', gift_amount: 5000, campaign: 'Capital Campaign', channel: 'Event', region: 'Northeast' },
  { donor_id: 'D030', donor_name: 'Kenneth Lee', segment: 'First-Time', gift_date: '2024-08-09', gift_amount: 100, campaign: 'Capital Campaign', channel: 'Online', region: 'Midwest' },

  // --- Giving Tuesday (Nov 2024) ---
  { donor_id: 'D031', donor_name: 'Lisa Anderson', segment: 'General', gift_date: '2024-11-03', gift_amount: 50, campaign: 'Giving Tuesday', channel: 'Online', region: 'West' },
  { donor_id: 'D032', donor_name: 'Andrew Taylor', segment: 'First-Time', gift_date: '2024-11-03', gift_amount: 25, campaign: 'Giving Tuesday', channel: 'Online', region: 'South' },
  { donor_id: 'D033', donor_name: 'Michelle Thomas', segment: 'Sustainer', gift_date: '2024-11-03', gift_amount: 100, campaign: 'Giving Tuesday', channel: 'Online', region: 'Northeast' },
  { donor_id: 'D034', donor_name: 'George Jackson', segment: 'Mid-Level', gift_date: '2024-11-03', gift_amount: 500, campaign: 'Giving Tuesday', channel: 'Email', region: 'Midwest' },
  { donor_id: 'D035', donor_name: 'Rebecca White', segment: 'Major Gifts', gift_date: '2024-11-03', gift_amount: 2000, campaign: 'Giving Tuesday', channel: 'Online', region: 'West' },
  { donor_id: 'D036', donor_name: 'Daniel Harris', segment: 'Lapsed', gift_date: '2024-11-03', gift_amount: 75, campaign: 'Giving Tuesday', channel: 'Email', region: 'South' },
  { donor_id: 'D002', donor_name: 'Franklin Cho', segment: 'Mid-Level', gift_date: '2024-11-03', gift_amount: 250, campaign: 'Giving Tuesday', channel: 'Online', region: 'Northeast' },
  { donor_id: 'D003', donor_name: 'Susan Nakamura', segment: 'Sustainer', gift_date: '2024-11-03', gift_amount: 25, campaign: 'Giving Tuesday', channel: 'Online', region: 'West' },

  // --- Year-End Appeal 2024 (Nov–Dec 2024) ---
  { donor_id: 'D001', donor_name: 'Eleanor Hartman', segment: 'Major Gifts', gift_date: '2024-11-15', gift_amount: 5000, campaign: 'Year-End Appeal 2024', channel: 'Direct Mail', region: 'Midwest' },
  { donor_id: 'D005', donor_name: 'Maria Santos', segment: 'Major Gifts', gift_date: '2024-11-20', gift_amount: 8000, campaign: 'Year-End Appeal 2024', channel: 'Event', region: 'Northeast' },
  { donor_id: 'D007', donor_name: 'Patricia Webb', segment: 'Mid-Level', gift_date: '2024-11-28', gift_amount: 1000, campaign: 'Year-End Appeal 2024', channel: 'Phone', region: 'South' },
  { donor_id: 'D011', donor_name: 'Jennifer Park', segment: 'Mid-Level', gift_date: '2024-12-04', gift_amount: 750, campaign: 'Year-End Appeal 2024', channel: 'Email', region: 'West' },
  { donor_id: 'D037', donor_name: 'Steven Martinez', segment: 'First-Time', gift_date: '2024-12-06', gift_amount: 150, campaign: 'Year-End Appeal 2024', channel: 'Online', region: 'Midwest' },
  { donor_id: 'D038', donor_name: 'Donna Wilson', segment: 'Lapsed', gift_date: '2024-12-08', gift_amount: 200, campaign: 'Year-End Appeal 2024', channel: 'Direct Mail', region: 'Northeast' },
  { donor_id: 'D039', donor_name: 'Gary Moore', segment: 'General', gift_date: '2024-12-10', gift_amount: 35, campaign: 'Year-End Appeal 2024', channel: 'Email', region: 'South' },
  { donor_id: 'D009', donor_name: 'Linda Freeman', segment: 'Sustainer', gift_date: '2024-12-01', gift_amount: 25, campaign: 'Year-End Appeal 2024', channel: 'Online', region: 'Midwest' },
  { donor_id: 'D025', donor_name: 'Helen Carter', segment: 'Sustainer', gift_date: '2024-12-01', gift_amount: 25, campaign: 'Year-End Appeal 2024', channel: 'Online', region: 'Northeast' },
  { donor_id: 'D040', donor_name: 'Carol White', segment: 'Major Gifts', gift_date: '2024-12-15', gift_amount: 12500, campaign: 'Year-End Appeal 2024', channel: 'Event', region: 'West' },
  { donor_id: 'D010', donor_name: 'Michael Torres', segment: 'Major Gifts', gift_date: '2024-12-19', gift_amount: 15000, campaign: 'Year-End Appeal 2024', channel: 'Direct Mail', region: 'Northeast' },
  { donor_id: 'D041', donor_name: 'Raymond Scott', segment: 'Mid-Level', gift_date: '2024-12-20', gift_amount: 450, campaign: 'Year-End Appeal 2024', channel: 'Email', region: 'Midwest' },
  { donor_id: 'D042', donor_name: 'Christine Turner', segment: 'First-Time', gift_date: '2024-12-22', gift_amount: 100, campaign: 'Year-End Appeal 2024', channel: 'Online', region: 'West' },
  { donor_id: 'D017', donor_name: 'Brian Wilson', segment: 'Major Gifts', gift_date: '2024-12-28', gift_amount: 4000, campaign: 'Year-End Appeal 2024', channel: 'Event', region: 'Northeast' },
];
