import prisma from "../utils/prisma.util.js";

async function dashboard(req, res) {
  const unfinishedOrders = await prisma.order.findMany({
    where: {
      deletedAt: null,
      completedAt: null,
    },
  });

  const unfinishedReservations = await prisma.reservation.findMany({
    where: {
      deletedAt: null,
      completedAt: null,
    },
  });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const allOrdersAllTime = await prisma.order.findMany({
    where: {
      deletedAt: null,
    },
  });

  const allOrdersLastMonth = await prisma.order.findMany({
    where: {
      deletedAt: null,
      createdAt: {
        gte: oneMonthAgo,
      },
    },
  });

  const grossRevenueLastMonth = allOrdersLastMonth.reduce((prev, curr) => {
    return prev + curr.content.total;
  }, 0);

  const grossRevenue = allOrdersAllTime.reduce((prev, curr) => {
    return prev + curr.content.total;
  }, 0);

  const allReservationsLastMonth = await prisma.reservation.findMany({
    where: {
      deletedAt: null,
      createdAt: {
        gte: oneMonthAgo,
      },
    },
  });

  const allReservationssAllTime = await prisma.reservation.findMany({
    where: {
      deletedAt: null,
    },
  });

  res.json({
    unfinishedOrders,
    unfinishedReservations,
    allOrdersAllTime,
    allOrdersLastMonth,
    allReservationsLastMonth,
    allReservationssAllTime,
    grossRevenue,
    grossRevenueLastMonth,
  });
}

export default dashboard;
