import prisma from "../utils/prisma.util.js";

async function findMany(key, where = {}, sortBy = {}, select = undefined) {
  return await prisma[key].findMany({
    where: { deletedAt: null, ...where },
    orderBy: sortBy || {
      sequenceNumber: "asc",
    },
    select,
  });
}

async function findSingle(key, id, select = undefined) {
  return await prisma[key].findUnique({
    where: { deletedAt: null, id },
    select,
  });
}

async function createSingle(key, data, select = undefined) {
  return await prisma[key].create({
    data,
    select,
  });
}

async function updateSingle(key, id, data, select = undefined) {
  return await prisma[key].update({
    where: { deletedAt: null, id },
    data,
    select,
  });
}

async function removeSingle(key, id, select = undefined) {
  return await prisma[key].update({
    where: { deletedAt: null, id },
    data: {
      deletedAt: new Date(),
    },
    select,
  });
}

export default {
  findMany,
  findSingle,
  createSingle,
  updateSingle,
  removeSingle,
};
