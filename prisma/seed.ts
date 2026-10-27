import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CivicFlow database seeding...");

  // 1. Clean existing records in safe order
  await prisma.statusHistory.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.fieldCrew.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("CivicPass2026!", salt);

  // 2. Seed Departments
  const deptRoads = await prisma.department.create({
    data: {
      name: "Department of Public Works",
      slug: "public-works",
      description: "Responsible for municipal roadways, asphalt resurfacing, sidewalks, and stormwater drainage.",
      contactEmail: "publicworks@civicflow.city",
      slaHoursDefault: 48,
    },
  });

  const deptSanitation = await prisma.department.create({
    data: {
      name: "Waste Management Authority",
      slug: "waste-management",
      description: "Handles solid waste collection, illegal dumping removal, recycling stations, and civic cleanliness.",
      contactEmail: "sanitation@civicflow.city",
      slaHoursDefault: 24,
    },
  });

  const deptWater = await prisma.department.create({
    data: {
      name: "Water Supply & Drainage Board",
      slug: "water-drainage",
      description: "Operates clean drinking water pipelines, sewer conduits, storm mains, and fire hydrants.",
      contactEmail: "waterboard@civicflow.city",
      slaHoursDefault: 12,
    },
  });

  const deptElectrical = await prisma.department.create({
    data: {
      name: "Electrical & Lighting Bureau",
      slug: "electrical-lighting",
      description: "Maintains civic street illumination, public power lines, traffic signals, and substation security.",
      contactEmail: "lighting@civicflow.city",
      slaHoursDefault: 24,
    },
  });

  const deptParks = await prisma.department.create({
    data: {
      name: "Parks & Public Infrastructure",
      slug: "parks-infrastructure",
      description: "Manages public plazas, park equipment, benches, footbridges, guardrails, and civic monuments.",
      contactEmail: "parks@civicflow.city",
      slaHoursDefault: 72,
    },
  });

  const deptTraffic = await prisma.department.create({
    data: {
      name: "Traffic & Mobility Operations",
      slug: "traffic-mobility",
      description: "Oversees road markings, parking enforcement, traffic flow telemetry, and active mobility corridors.",
      contactEmail: "traffic@civicflow.city",
      slaHoursDefault: 24,
    },
  });

  // 3. Seed Field Crews
  const crewRoadsBravo = await prisma.fieldCrew.create({
    data: {
      name: "Road Patching Crew Bravo",
      leadName: "Hector Vance",
      vehicleId: "PW-TRUCK-14",
      phone: "+1 (555) 789-0114",
      departmentId: deptRoads.id,
      active: true,
    },
  });

  await prisma.fieldCrew.create({
    data: {
      name: "Rapid Asphalt Response Unit",
      leadName: "Tom Hardy",
      vehicleId: "PW-HOTMIX-07",
      phone: "+1 (555) 789-0107",
      departmentId: deptRoads.id,
      active: true,
    },
  });

  const crewSanitationAlpha = await prisma.fieldCrew.create({
    data: {
      name: "Sanitation Rapid Sweep Alpha",
      leadName: "Sarah Miller",
      vehicleId: "WM-COMPACT-22",
      phone: "+1 (555) 789-0222",
      departmentId: deptSanitation.id,
      active: true,
    },
  });

  const crewWaterHydro = await prisma.fieldCrew.create({
    data: {
      name: "Hydro-Vac Drainage Unit",
      leadName: "Carlos Diaz",
      vehicleId: "WB-HYDRO-09",
      phone: "+1 (555) 789-0309",
      departmentId: deptWater.id,
      active: true,
    },
  });

  const crewElectricalSky = await prisma.fieldCrew.create({
    data: {
      name: "High-Reach Luminaire Lift #2",
      leadName: "Ray Campbell",
      vehicleId: "EL-BOOM-18",
      phone: "+1 (555) 789-0418",
      departmentId: deptElectrical.id,
      active: true,
    },
  });

  // 4. Seed Users (Citizens & Authorities)
  const citizenMaya = await prisma.user.create({
    data: {
      name: "Maya Chen",
      email: "citizen@civicflow.org",
      passwordHash,
      role: "CITIZEN",
      phone: "+1 (555) 234-5678",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  const citizenElena = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena@civicflow.org",
      passwordHash,
      role: "CITIZEN",
      phone: "+1 (555) 345-6789",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  });

  const authorityDavid = await prisma.user.create({
    data: {
      name: "David O'Connor",
      email: "authority@civicflow.org",
      passwordHash,
      role: "AUTHORITY",
      phone: "+1 (555) 456-7890",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      departmentId: deptRoads.id,
    },
  });

  const authoritySarah = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "supervisor.sanitation@civicflow.org",
      passwordHash,
      role: "AUTHORITY",
      phone: "+1 (555) 567-8901",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      departmentId: deptSanitation.id,
    },
  });

  // 5. Seed Issues Across All Lifecycles

  // Issue 1: In Progress Pothole
  const issue1 = await prisma.issue.create({
    data: {
      ticketNumber: "CF-1001",
      title: "Severe road cavity near central transit stop",
      description: "Deep 40cm pothole exposing rebar foundation. Causes bicycles and city buses to swerve into oncoming traffic.",
      category: "ROADS",
      subcategory: "Pothole / Road Cavity",
      priority: "HIGH",
      status: "IN_PROGRESS",
      address: "442 Elm Street, Ward 4",
      latitude: 40.7138,
      longitude: -74.0080,
      ward: "Ward 4 (Central)",
      photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80",
      reporterId: citizenMaya.id,
      departmentId: deptRoads.id,
      assigneeId: authorityDavid.id,
      crewId: crewRoadsBravo.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    },
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        issueId: issue1.id,
        fromStatus: "REPORTED",
        toStatus: "REPORTED",
        actorId: citizenMaya.id,
        note: "Issue observed and submitted via citizen mobile web app.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      },
      {
        issueId: issue1.id,
        fromStatus: "REPORTED",
        toStatus: "IN_REVIEW",
        actorId: authorityDavid.id,
        note: "Triaged by Public Works dispatch. High safety risk confirmed.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
      },
      {
        issueId: issue1.id,
        fromStatus: "IN_REVIEW",
        toStatus: "ASSIGNED",
        actorId: authorityDavid.id,
        note: "Dispatched to Road Patching Crew Bravo with thermal asphalt truck.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
      },
      {
        issueId: issue1.id,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        actorId: authorityDavid.id,
        note: "Crew Bravo arrived on site. Traffic cones placed; cavity clearing in progress.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
  });

  // Issue 2: Resolved Pothole/Waste (Awaiting Citizen Verification!)
  const issue2 = await prisma.issue.create({
    data: {
      ticketNumber: "CF-1002",
      title: "Commercial cardboard and solid waste dumping",
      description: "Severe overflow of cardboard cartons and rotting organic matter blocking the pedestrian walkway behind the farmers market.",
      category: "SANITATION",
      subcategory: "Illegal Dumping",
      priority: "MEDIUM",
      status: "RESOLVED",
      address: "18 Market Square Alley, Ward 2",
      latitude: 40.7160,
      longitude: -74.0040,
      ward: "Ward 2 (Market District)",
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
      resolutionPhotoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
      resolutionNotes: "Sanitation Rapid Sweep Alpha removed 1.8 metric tons of debris. Pavement pressure-washed and sanitized. Notice issued to adjacent merchant.",
      reporterId: citizenMaya.id,
      departmentId: deptSanitation.id,
      assigneeId: authoritySarah.id,
      crewId: crewSanitationAlpha.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        issueId: issue2.id,
        fromStatus: "REPORTED",
        toStatus: "REPORTED",
        actorId: citizenMaya.id,
        note: "Citizen reported commercial waste obstruction.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      },
      {
        issueId: issue2.id,
        fromStatus: "REPORTED",
        toStatus: "ASSIGNED",
        actorId: authoritySarah.id,
        note: "Assigned to Waste Management Alpha Compactor Unit.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      },
      {
        issueId: issue2.id,
        fromStatus: "ASSIGNED",
        toStatus: "RESOLVED",
        actorId: authoritySarah.id,
        note: "Site cleared and sanitized with before/after photo evidence attached. Pending citizen verification.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
    ],
  });

  // Issue 3: Verified Streetlight (Citizen confirmed!)
  const issue3 = await prisma.issue.create({
    data: {
      ticketNumber: "CF-1003",
      title: "Flickering historical street lamp causing dark zone",
      description: "Fixture #412 strobes continuously and drops out after 9 PM, leaving crosswalk completely unlit for pedestrians.",
      category: "ELECTRICAL",
      subcategory: "Streetlight Malfunction",
      priority: "LOW",
      status: "VERIFIED",
      address: "88 Highland Avenue, Ward 1",
      latitude: 40.7185,
      longitude: -74.0095,
      ward: "Ward 1 (North Heights)",
      photoUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
      resolutionPhotoUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80",
      resolutionNotes: "Replaced faulty sodium-vapor ballast with warm 3000K dark-sky certified LED unit. Luminaire tested at 100% output.",
      reporterId: citizenMaya.id,
      departmentId: deptElectrical.id,
      assigneeId: authorityDavid.id,
      crewId: crewElectricalSky.id,
      citizenRating: 5,
      citizenFeedback: "Verified on evening dog walk. The new warm LED is bright, glare-free, and crosswalk is safe again. Outstanding work!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        issueId: issue3.id,
        fromStatus: "REPORTED",
        toStatus: "REPORTED",
        actorId: citizenMaya.id,
        note: "Reported flickering luminaire.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
      },
      {
        issueId: issue3.id,
        fromStatus: "REPORTED",
        toStatus: "RESOLVED",
        actorId: authorityDavid.id,
        note: "LED luminaire retrofitted and tested.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        issueId: issue3.id,
        fromStatus: "RESOLVED",
        toStatus: "VERIFIED",
        actorId: citizenMaya.id,
        note: "Citizen inspected and confirmed repair. 5-Star rating awarded.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
    ],
  });

  // Issue 4: Critical Water Burst
  const issue4 = await prisma.issue.create({
    data: {
      ticketNumber: "CF-1004",
      title: "High-pressure water main burst flooding intersection",
      description: "Treated potable water spewing from subterranean valve box. Substantial roadway flooding; water entering subterranean storefront basements.",
      category: "WATER",
      subcategory: "Water Main Burst",
      priority: "CRITICAL",
      status: "ASSIGNED",
      address: "210 4th Avenue & Pine, Ward 3",
      latitude: 40.7112,
      longitude: -74.0025,
      ward: "Ward 3 (Downtown)",
      photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
      reporterId: citizenElena.id,
      departmentId: deptWater.id,
      assigneeId: authorityDavid.id,
      crewId: crewWaterHydro.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  });

  await prisma.statusHistory.create({
    data: {
      issueId: issue4.id,
      fromStatus: "REPORTED",
      toStatus: "ASSIGNED",
      actorId: authorityDavid.id,
      note: "CRITICAL EMERGENCY: Isolation gate valves scheduled for immediate shutdown. Hydro-Vac dispatched.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  });

  // Issue 5: Reopened Issue (Unhappy path demonstrated!)
  const issue5 = await prisma.issue.create({
    data: {
      ticketNumber: "CF-1005",
      title: "Damaged pedestrian guardrail on riverfront footbridge",
      description: "Vehicle collision bent 4 meters of steel railing over the river drop. Extreme fall hazard for children.",
      category: "INFRASTRUCTURE",
      subcategory: "Pedestrian Guardrail",
      priority: "HIGH",
      status: "REOPENED",
      address: "Riverfront Promenade at Pier 6, Ward 3",
      latitude: 40.7090,
      longitude: -74.0120,
      ward: "Ward 3 (Downtown)",
      photoUrl: "https://images.unsplash.com/photo-1588718889399-f2735738096f?auto=format&fit=crop&w=1000&q=80",
      resolutionPhotoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80",
      resolutionNotes: "Installed temporary hazard tape and warning cones.",
      reopenReason: "Contractor only placed orange tape! The 4-meter gap over the river is still open and tape has blown away in wind. Physical steel barrier needed urgently.",
      reporterId: citizenElena.id,
      departmentId: deptParks.id,
      assigneeId: authorityDavid.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      reopenedAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
    },
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        issueId: issue5.id,
        fromStatus: "REPORTED",
        toStatus: "REPORTED",
        actorId: citizenElena.id,
        note: "Reported dangerous guardrail collapse.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      },
      {
        issueId: issue5.id,
        fromStatus: "REPORTED",
        toStatus: "RESOLVED",
        actorId: authorityDavid.id,
        note: "Field crew marked resolved after temporary caution flagging.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      },
      {
        issueId: issue5.id,
        fromStatus: "RESOLVED",
        toStatus: "REOPENED",
        actorId: citizenElena.id,
        note: "REOPENED: Flagging tape is insufficient; unprotected 8-meter river fall hazard remains.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
      },
    ],
  });

  // Issue 6: Freshly Reported Issue
  await prisma.issue.create({
    data: {
      ticketNumber: "CF-1006",
      title: "Broken traffic signal cycle causing gridlock",
      description: "Eastbound traffic light remains green for only 4 seconds, causing 35-minute vehicle backup through school zone.",
      category: "TRAFFIC",
      subcategory: "Signal Timing",
      priority: "MEDIUM",
      status: "REPORTED",
      address: "Grand Avenue & 7th Street, Ward 5",
      latitude: 40.7170,
      longitude: -74.0010,
      ward: "Ward 5 (Eastside)",
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80",
      reporterId: citizenMaya.id,
      departmentId: deptTraffic.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    },
  });

  console.log("✅ Seed completed successfully with realistic municipal data!");
  console.log("   • 6 Municipal Departments");
  console.log("   • 5 Dedicated Field Crews");
  console.log("   • 2 Citizens (Maya Chen, Elena Rostova)");
  console.log("   • 2 Authority Supervisors (David O'Connor, Sarah Jenkins)");
  console.log("   • 6 Issues in diverse lifecycle states (REPORTED, IN_PROGRESS, RESOLVED, VERIFIED, REOPENED)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
