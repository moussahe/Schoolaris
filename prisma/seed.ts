import {
  PrismaClient,
  Role,
  Subject,
  GradeLevel,
  ContentType,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.progress.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.review.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.child.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleaned existing data");

  // Create password hash
  const passwordHash = await hash("password123", 12);

  // Create Teacher
  const teacher = await prisma.user.create({
    data: {
      name: "Marie Dupont",
      email: "teacher@schoolaris.fr",
      password: passwordHash,
      role: Role.TEACHER,
      emailVerified: new Date(),
      teacherProfile: {
        create: {
          slug: "marie-dupont",
          headline: "Professeure de Mathematiques - 15 ans d'experience",
          bio: "Professeure de mathematiques avec 15 ans d'experience. Passionnee par la pedagogie et les nouvelles methodes d'apprentissage.",
          specialties: [Subject.MATHEMATIQUES],
          yearsExperience: 15,
          isVerified: true,
        },
      },
    },
  });
  console.log("Created teacher:", teacher.email);

  // Create Parent
  const parent = await prisma.user.create({
    data: {
      name: "Jean Martin",
      email: "parent@schoolaris.fr",
      password: passwordHash,
      role: Role.PARENT,
      emailVerified: new Date(),
    },
  });
  console.log("Created parent:", parent.email);

  // Create Children for Parent
  const child1 = await prisma.child.create({
    data: {
      firstName: "Lucas",
      lastName: "Martin",
      gradeLevel: GradeLevel.CM1,
      parentId: parent.id,
    },
  });

  const child2 = await prisma.child.create({
    data: {
      firstName: "Emma",
      lastName: "Martin",
      gradeLevel: GradeLevel.SIXIEME,
      parentId: parent.id,
    },
  });
  console.log("Created children:", child1.firstName, child2.firstName);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin Schoolaris",
      email: "admin@schoolaris.fr",
      password: passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("Created admin:", admin.email);

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Les Fractions - Cours Complet CM1/CM2",
      slug: "fractions-cm1-cm2",
      subtitle: "Maitriser les fractions de A a Z",
      description:
        "Un cours complet pour comprendre et maitriser les fractions. Ideal pour les eleves de CM1 et CM2 qui souhaitent consolider leurs bases en mathematiques. Ce cours couvre les notions fondamentales jusqu'aux operations sur les fractions.",
      subject: Subject.MATHEMATIQUES,
      gradeLevel: GradeLevel.CM1,
      price: 1999, // 19.99 EUR
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
      authorId: teacher.id,
      isPublished: true,
      learningOutcomes: [
        "Comprendre ce qu'est une fraction",
        "Savoir comparer des fractions",
        "Additionner et soustraire des fractions",
        "Resoudre des problemes avec des fractions",
      ],
      requirements: [
        "Connaitre les tables de multiplication",
        "Savoir effectuer des divisions simples",
      ],
      chapters: {
        create: [
          {
            title: "Introduction aux fractions",
            description:
              "Decouvrez ce qu'est une fraction et comment la representer",
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Qu'est-ce qu'une fraction ?",
                  description: "Comprendre le concept de fraction",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 15,
                  position: 1,
                  isPublished: true,
                  isFreePreview: true,
                },
                {
                  title: "Representer une fraction",
                  description:
                    "Apprendre a representer visuellement une fraction",
                  contentType: ContentType.TEXT,
                  content:
                    "Une fraction se represente sous la forme a/b ou a est le numerateur et b le denominateur...",
                  duration: 10,
                  position: 2,
                  isPublished: true,
                },
              ],
            },
          },
          {
            title: "Comparer des fractions",
            description: "Apprendre a comparer des fractions entre elles",
            position: 2,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Fractions de meme denominateur",
                  description:
                    "Comparer des fractions ayant le meme denominateur",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 12,
                  position: 1,
                  isPublished: true,
                },
                {
                  title: "Quiz - Comparaison de fractions",
                  description: "Testez vos connaissances",
                  contentType: ContentType.QUIZ,
                  duration: 10,
                  position: 2,
                  isPublished: true,
                },
              ],
            },
          },
          {
            title: "Operations sur les fractions",
            description: "Addition et soustraction de fractions",
            position: 3,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Additionner des fractions",
                  description: "Apprendre a additionner des fractions",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 18,
                  position: 1,
                  isPublished: true,
                },
                {
                  title: "Exercices pratiques",
                  description: "Mettez en pratique vos connaissances",
                  contentType: ContentType.EXERCISE,
                  duration: 20,
                  position: 2,
                  isPublished: true,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Created course:", course1.title);

  const course2 = await prisma.course.create({
    data: {
      title: "Conjugaison Francaise - Les Temps de Base",
      slug: "conjugaison-temps-base",
      subtitle: "Maitriser present, imparfait et futur",
      description:
        "Apprenez a conjuguer parfaitement les verbes francais aux temps essentiels. Ce cours couvre le present, l'imparfait et le futur simple avec de nombreux exercices pratiques.",
      subject: Subject.FRANCAIS,
      gradeLevel: GradeLevel.CE2,
      price: 1499, // 14.99 EUR
      imageUrl:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
      authorId: teacher.id,
      isPublished: true,
      learningOutcomes: [
        "Conjuguer au present de l'indicatif",
        "Conjuguer a l'imparfait",
        "Conjuguer au futur simple",
        "Identifier les groupes de verbes",
      ],
      requirements: [
        "Savoir lire et ecrire",
        "Connaitre les pronoms personnels",
      ],
      chapters: {
        create: [
          {
            title: "Le present de l'indicatif",
            description: "Maitriser le temps present",
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Les verbes du 1er groupe",
                  description: "Conjuguer les verbes en -er",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 12,
                  position: 1,
                  isPublished: true,
                  isFreePreview: true,
                },
                {
                  title: "Les verbes du 2e groupe",
                  description: "Conjuguer les verbes en -ir",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 10,
                  position: 2,
                  isPublished: true,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Created course:", course2.title);

  const course3 = await prisma.course.create({
    data: {
      title: "Histoire de France - La Revolution",
      slug: "histoire-revolution-francaise",
      subtitle: "Comprendre 1789 et ses consequences",
      description:
        "Plongez dans l'une des periodes les plus importantes de l'histoire de France. De la prise de la Bastille a Napoleon, decouvrez les evenements qui ont change le monde.",
      subject: Subject.HISTOIRE_GEO,
      gradeLevel: GradeLevel.QUATRIEME,
      price: 2499, // 24.99 EUR
      imageUrl:
        "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800",
      authorId: teacher.id,
      isPublished: true,
      learningOutcomes: [
        "Comprendre les causes de la Revolution",
        "Connaitre les evenements cles de 1789",
        "Identifier les acteurs majeurs",
        "Analyser les consequences de la Revolution",
      ],
      requirements: ["Notions de base en histoire"],
      chapters: {
        create: [
          {
            title: "Les causes de la Revolution",
            description: "Comprendre le contexte pre-revolutionnaire",
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "La societe d'Ancien Regime",
                  description: "Les trois ordres et leurs privileges",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 20,
                  position: 1,
                  isPublished: true,
                  isFreePreview: true,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Created course:", course3.title);

  // Create a free course
  const course4 = await prisma.course.create({
    data: {
      title: "Introduction a la Programmation",
      slug: "intro-programmation",
      subtitle: "Premiers pas avec Scratch",
      description:
        "Decouvrez les bases de la programmation de maniere ludique avec Scratch. Cours gratuit pour debutants.",
      subject: Subject.NSI,
      gradeLevel: GradeLevel.SIXIEME,
      price: 0, // Free
      imageUrl:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
      authorId: teacher.id,
      isPublished: true,
      learningOutcomes: [
        "Comprendre la logique de programmation",
        "Creer des animations simples",
        "Utiliser les boucles et conditions",
      ],
      requirements: [],
      chapters: {
        create: [
          {
            title: "Decouverte de Scratch",
            description: "Premiers pas dans l'interface",
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Bienvenue dans Scratch",
                  description: "Presentation de l'interface",
                  contentType: ContentType.VIDEO,
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 8,
                  position: 1,
                  isPublished: true,
                  isFreePreview: true,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Created course:", course4.title);

  // Create Purchases (30% platform fee)
  const platformFeePercent = 0.3;

  const purchase1 = await prisma.purchase.create({
    data: {
      userId: parent.id,
      courseId: course1.id,
      childId: child1.id,
      amount: course1.price,
      platformFee: Math.round(course1.price * platformFeePercent),
      teacherRevenue: Math.round(course1.price * (1 - platformFeePercent)),
      status: "COMPLETED",
      stripePaymentIntentId:
        "pi_test_" + Math.random().toString(36).substr(2, 9),
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      userId: parent.id,
      courseId: course2.id,
      childId: child2.id,
      amount: course2.price,
      platformFee: Math.round(course2.price * platformFeePercent),
      teacherRevenue: Math.round(course2.price * (1 - platformFeePercent)),
      status: "COMPLETED",
      stripePaymentIntentId:
        "pi_test_" + Math.random().toString(36).substr(2, 9),
    },
  });

  const purchase3 = await prisma.purchase.create({
    data: {
      userId: parent.id,
      courseId: course4.id,
      childId: child1.id,
      amount: 0,
      platformFee: 0,
      teacherRevenue: 0,
      status: "COMPLETED",
    },
  });
  console.log("Created purchases");

  // Create Progress for Lucas on Fractions course
  const lessons1 = await prisma.lesson.findMany({
    where: { chapter: { courseId: course1.id } },
    orderBy: { position: "asc" },
  });

  for (let i = 0; i < Math.min(3, lessons1.length); i++) {
    await prisma.progress.create({
      data: {
        lessonId: lessons1[i].id,
        childId: child1.id,
        isCompleted: true,
      },
    });
  }
  console.log("Created progress for Lucas");

  // Create Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment:
        "Excellent cours ! Ma fille a enfin compris les fractions grace aux explications tres claires.",
      courseId: course1.id,
      userId: parent.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment:
        "Tres bon cours de conjugaison. Les exercices sont bien structures.",
      courseId: course2.id,
      userId: parent.id,
    },
  });
  console.log("Created reviews");

  console.log("\n✅ Database seeded successfully!\n");
  console.log("Test accounts:");
  console.log("  Teacher: teacher@schoolaris.fr / password123");
  console.log("  Parent:  parent@schoolaris.fr / password123");
  console.log("  Admin:   admin@schoolaris.fr / password123");
  console.log("\nChildren: Lucas (CM1), Emma (6eme)");
  console.log("Courses: 4 courses created (3 paid, 1 free)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
