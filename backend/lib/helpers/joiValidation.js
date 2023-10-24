module.exports = (error) => {
  const joiErrors = error.details.map((error) => {
    return {
      message: getMessage(error),
      key: error.context.key || (error.context.peers || [])[0],
    };
  });

  return {
    type: "validation",
    errors: joiErrors,
  };
};

const getMessage = (error) => {
  const { message, type, context } = error;
  const { key, valids, peers } = context;

  switch (type) {
    case "any.required":
      return `${key} is required.`;

    case "string.alphanum":
      return `${key} must contain only alphanumeric characters.`;

    case "string.pattern.base":
      return `${key} must match the pattern specified.`;

    case "any.ref":
      return `${key} must match ${valids.key}.`;

    case "any.only": {
      const first = valids[0];
      return typeof first === "object" && "key" in first
        ? `${key} must match the value of '${first.key}'.`
        : `${key} has an invalid value.`;
    }

    case "object.missing": {
      return `${peers.join("/")} required.`;
    }

    default:
      return { message, key };
  }
};
