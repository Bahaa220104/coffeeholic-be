import service from "../services/basic.service.js";
import validateObject from "../utils/validate.util.js";
import tryCatch from "../utils/tryCatch.util.js";
import prisma from "../utils/prisma.util.js";
import compareArrays from "../utils/compareArrays.util.js";

const matrix = {
  product: {
    findMany: {
      select: {
        id: true,
        name: true,
        price: true,
      },
      input: (query) => {
        const where = {};
        if (query.type) {
          where.types = { some: { name: query.type } };
        }
        return where;
      },
    },
    findSingle: {
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        sequenceNumber: true,
        types: {
          select: {
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        addons: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      output: (product) => {
        product.types = product.types.map((type) => type.name);
        product.categories = product.categories.map((category) => category.id);
        product.addons = product.addons.map((addon) => addon.id);
        return product;
      },
    },
    create: {
      select: { id: true, name: true },
      validate: [
        "name",
        "image",
        "description",
        "sequenceNumber",
        "price",
        "types",
        "categories",
        "addons",
        "variants",
      ],
      input: (data) => {
        console.log("Create Data: ", data);
        if (!data.types?.length) {
          delete data.types;
        } else {
          data.types = {
            connect: data.types.map((type) => {
              return {
                name: type,
              };
            }),
          };
        }

        if (!data.categories?.length) {
          delete data.categories;
        } else {
          data.categories = {
            connect: data.categories.map((category) => {
              return {
                id: category,
              };
            }),
          };
        }

        if (!data.addons?.length) {
          delete data.addons;
        } else {
          data.addons = {
            connect: data.addons.map((addon) => {
              return {
                id: addon,
              };
            }),
          };
        }

        console.log("Create Data After: ", data);
        return data;
      },
      output: (data) => {
        return data;
      },
    },
    update: {
      select: { id: true, name: true },
      validate: [
        "name",
        "image",
        "description",
        "sequenceNumber",
        "price",
        "types",
        "categories",
        "addons",
        "variants",
      ],
      input: async (id, data) => {
        if (!data.types && !data.categories && !data.addons) return data;

        const oldData = await prisma.product.findUnique({
          where: { id, deletedAt: null },
          select: {
            types: true,
            categories: true,
            addons: true,
          },
        });

        if (!oldData) throw new Error("Not found");

        if (data.types) {
          const [toBeRemoved, toBeAdded] = compareArrays(
            oldData.types.map((v) => v.name),
            data.types,
            (a, b) => a == b
          );
          data.types = {
            connect: toBeAdded.map((v) => ({ name: v })),
            disconnect: toBeRemoved.map((v) => ({ name: v })),
          };
        }

        if (data.categories) {
          const [toBeRemoved, toBeAdded] = compareArrays(
            oldData.categories.map((v) => v.id),
            data.categories,
            (a, b) => a == b
          );

          data.categories = {
            connect: toBeAdded.map((v) => ({ id: v })),
            disconnect: toBeRemoved.map((v) => ({ id: v })),
          };
        }

        if (data.addons) {
          const [toBeRemoved, toBeAdded] = compareArrays(
            oldData.addons.map((v) => v.id),
            data.addons,
            (a, b) => a == b
          );

          data.addons = {
            connect: toBeAdded.map((v) => ({ id: v })),
            disconnect: toBeRemoved.map((v) => ({ id: v })),
          };
        }

        console.log("Update Data After: ", data);
        return data;
      },
    },
    remove: {
      select: { id: true, name: true },
    },
  },

  category: {
    findMany: {
      select: {
        id: true,
        name: true,
        products: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            description: true,
            addons: true,
            types: true,
            variantGroups: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                name: true,
                variants: {
                  where: {
                    deletedAt: null,
                  },
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    variantGroup: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    findSingle: {
      select: {
        id: true,
        name: true,
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    create: {
      select: { id: true, name: true },
      validate: ["name"],
    },
    update: {
      select: { id: true, name: true },
      validate: ["name"],
    },
    remove: {
      select: { id: true, name: true },
    },
  },

  variant: {
    findMany: {
      select: {
        id: true,
        name: true,
        productId: true,
        price: true,
        variantGroupId: true,
      },
      input: (query) => {
        const where = {};
        if (query.productId) {
          where.product = { id: Number(query.productId) };
        }
        return where;
      },
    },
    findSingle: {
      select: {
        id: true,
        name: true,
        productId: true,
        price: true,
        variantGroupId: true,
      },
    },
    create: {
      select: { id: true, name: true, productId: true, price: true },
      validate: ["name", "productId", "price", "variantGroupId"],
      input: (data) => {
        data.product = { connect: { id: data.productId } };
        delete data.productId;

        data.variantGroup = { connect: { id: data.variantGroupId } };
        delete data.variantGroupId;

        return data;
      },
    },
    update: {
      select: { id: true, name: true, productId: true, price: true },
      validate: ["name", "price"],
    },
    remove: {
      select: { id: true, name: true },
    },
  },

  variantgroup: {
    findMany: {
      select: {
        id: true,
        name: true,
        productId: true,
      },
      input: (query) => {
        const where = {};
        if (query.productId) {
          where.product = { id: Number(query.productId) };
        }
        return where;
      },
    },
    findSingle: {
      select: {
        id: true,
        name: true,
        productId: true,
      },
    },
    create: {
      select: { id: true, name: true },
      validate: ["name", "productId"],
      input: (data) => {
        data.product = { connect: { id: data.productId } };
        delete data.productId;

        return data;
      },
    },
    update: {
      select: { id: true, name: true },
      validate: ["name", "productId"],
    },
    remove: {
      select: { id: true, name: true },
    },
  },

  order: {
    findMany: {
      select: {
        id: true,
        type: true,
        time: true,
        review: true,
        content: true,
        createdAt: true,
        completedAt: true,
        city: true,
        building: true,
        address: true,
        user: true,
      },
      input: (query, user) => {
        if (user.isAdmin) {
          const where = {};
          if (query.incomplete) {
            where.completedAt = null;
          }
          return where;
        } else
          return {
            userId: user.id,
          };
      },
      sortBy: () => {
        return {
          createdAt: "desc",
        };
      },
    },
    findSingle: {
      select: {
        id: true,
        content: true,
        type: true,
        time: true,
        address: true,
        city: true,
        building: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    },
    create: {
      select: { id: true, type: true },
      validate: [
        "content",
        "type",
        "time",
        "address",
        "city",
        "building",
        "userId",
      ],
      input: (data, user) => {
        data.userId = user.id;
        return data;
      },
    },
    update: {
      select: { id: true, type: true },
      validate: ["completedAt"],
    },
    remove: {
      select: { id: true, type: true },
    },
  },

  reservation: {
    findMany: {
      select: {
        id: true,
        content: true,
        date: true,
        time: true,
        completedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      input: (query, user) => {
        if (user.isAdmin) {
          const where = {};
          if (query.incomplete) {
            where.completedAt = null;
          }
          return where;
        } else
          return {
            userId: user.id,
          };
      },
      sortBy: () => {
        return {
          createdAt: "desc",
        };
      },
    },
    findSingle: {
      select: {
        id: true,
        content: true,
        date: true,
        time: true,
        completedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    },
    create: {
      select: { id: true, date: true },
      validate: ["content", "date", "time", "userId"],
      input: (data, user) => {
        data.userId = user.id;
        return data;
      },
    },
    update: {
      select: { id: true, date: true },
      validate: ["completedAt"],
    },
    remove: {
      select: { id: true, date: true },
    },
  },

  review: {
    findMany: {
      select: {
        id: true,
        rating: true,
        remarks: true,
        order: {
          include: {
            user: true,
          },
        },
      },
    },
    findSingle: {
      select: {
        id: true,
        rating: true,
        remarks: true,
        order: {
          where: {
            deletedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
    },
    create: {
      select: { id: true },
      validate: ["orderId", "rating", "remarks"],
      input: (data) => {
        data.order = {
          connect: {
            id: data.orderId,
          },
        };
        delete data.orderId;

        return data;
      },
    },
    update: {
      select: { id: true },
      validate: ["name", "rating", "remarks"],
    },
    remove: {
      select: { id: true },
    },
  },

  user: {
    findMany: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
      },
    },
    findSingle: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        address: true,
        city: true,
        building: true,
      },
    },
    remove: {
      select: { id: true, firstName: true },
    },
  },

  faq: {
    findMany: {
      select: {
        id: true,
        question: true,
        answer: true,
      },
    },
    findSingle: {
      select: {
        id: true,
        question: true,
        answer: true,
      },
    },
    create: {
      select: { id: true, question: true },
      validate: ["question", "answer"],
    },
    update: {
      select: { id: true, question: true },
      validate: ["question", "answer"],
    },
    remove: {
      select: { id: true, question: true },
    },
  },

  businessinformation: {
    findMany: {
      select: {
        id: true,
        phone: true,
        email: true,
        address: true,
      },
    },
    findSingle: {
      select: {
        id: true,
        phone: true,
        email: true,
        address: true,
      },
    },
    update: {
      select: {
        id: true,
        phone: true,
        email: true,
        address: true,
      },
      validate: ["phone", "email", "address"],
    },
  },

  table: {
    findMany: {
      select: {
        id: true,
        number: true,
        description: true,
        seats: true,
        x: true,
        y: true,
        w: true,
        h: true,
      },
    },
    findSingle: {
      select: {
        id: true,
        number: true,
        description: true,
        seats: true,
        x: true,
        y: true,
        w: true,
        h: true,
      },
    },
    create: {
      select: { id: true, number: true },
      validate: ["number", "description", "seats", "x", "y", "w", "h"],
    },
    update: {
      select: { id: true, number: true },
      validate: ["number", "description", "seats", "x", "y", "w", "h"],
    },
    remove: {
      select: { id: true, number: true },
    },
  },
};

function findMany(key) {
  return tryCatch(async (req, res) => {
    let where = {};
    console.log("Query: ", req.query);
    if (matrix[key].findMany.input) {
      where = matrix[key].findMany.input(req.query, req.user);
    }

    let sortBy = {};
    if (matrix[key].findMany.sortBy) {
      sortBy = matrix[key].findMany.sortBy(req.query, req.user);
    }

    console.log("Where: ", matrix[key].findMany.input);

    const items = await service.findMany(
      key,
      where,
      sortBy,
      matrix[key].findMany.select
    );

    console.log(items);

    res.send(items);
  });
}

function findSingle(key) {
  return tryCatch(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) throw new Error("Id is required");

    let item = await service.findSingle(key, id, matrix[key].findSingle.select);

    if (matrix[key].findSingle.output) {
      item = matrix[key].findSingle.output(item);
    }

    res.send(item);
  });
}

function createSingle(key) {
  return tryCatch(async (req, res) => {
    let data = req.body;
    data = validateObject(matrix[key].create.validate, data);

    console.log("DATA: ", data);

    if (matrix[key].create.input) {
      data = matrix[key].create.input(data, req.user);
    }

    const item = await service.createSingle(
      key,
      data,
      matrix[key].create.select
    );

    res.send(item);
  });
}

function updateSingle(key) {
  return tryCatch(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) throw new Error("Id is required");

    let data = req.body;
    data = validateObject(matrix[key].update.validate, data);

    if (matrix[key].update.input) {
      data = await matrix[key].update.input(id, data);
    }

    const item = await service.updateSingle(
      key,
      id,
      data,
      matrix[key].update.select
    );

    res.send(item);
  });
}

function removeSingle(key) {
  return tryCatch(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) throw new Error("Id is required");

    const item = await service.removeSingle(key, id, matrix[key].remove.select);

    res.send(item);
  });
}

export default {
  findMany,
  findSingle,
  updateSingle,
  createSingle,
  removeSingle,
};
