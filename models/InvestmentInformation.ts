import mongoose, { Document, Model } from "mongoose";

interface IActiveInvestment {
  amount: number;
  plan: string;
  startDate: Date;
  maturityDate: Date;
  expectedReturn: number;
  dailyReturn: number;
  currentReturn: number;
  status: "active" | "completed" | "cancelled";
  lastReturnUpdate: Date;
  profit?: number;
}

interface IInvestmentStats {
  activeInvestmentsCount: number;
  completedInvestmentsCount: number;
  cancelledInvestmentsCount: number;
  totalLifetimeInvestments: number;
}

interface IInvestmentInformation extends Document {
  userId: mongoose.Types.ObjectId;
  accountBalance: number;
  totalInvestmentAmount: number;
  totalReturnsEarned: number;
  activeInvestments: IActiveInvestment[];
  investmentStats: IInvestmentStats;
  lastInvestmentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalActiveInvestments: number;
  totalCurrentReturns: number;
  totalProfit: number;
  package: string;
  updateReturns(): Promise<IInvestmentInformation>;
  calculateProfit(investment: IActiveInvestment): number; // Added method
}

const ActiveInvestmentSchema = new mongoose.Schema<IActiveInvestment>({
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  maturityDate: {
    type: Date,
    required: true,
  },
  expectedReturn: {
    type: Number,
    required: true,
  },
  dailyReturn: {
    type: Number,
    required: true,
  },
  currentReturn: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  lastReturnUpdate: {
    type: Date,
    required: true,
  },
  profit: {
    type: Number,
    default: 0,
  },
});

const createSchema = () => {
  const schema = new mongoose.Schema<IInvestmentInformation>({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    totalInvestmentAmount: {
      type: Number,
      default: 0,
    },
    totalReturnsEarned: {
      type: Number,
      default: 0,
    },
    totalProfit: {
      type: Number,
      default: 0,
    },
    package: {
      type: String,
      default: "No investment",
    },
    activeInvestments: {
      type: [ActiveInvestmentSchema],
      default: [],
    },
    investmentStats: {
      activeInvestmentsCount: {
        type: Number,
        default: 0,
      },
      completedInvestmentsCount: {
        type: Number,
        default: 0,
      },
      cancelledInvestmentsCount: {
        type: Number,
        default: 0,
      },
      totalLifetimeInvestments: {
        type: Number,
        default: 0,
      },
    },
    lastInvestmentDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  schema.pre("save", function (next) {
    this.updatedAt = new Date();

    // Calculate total profit before saving
    this.totalProfit = this.activeInvestments.reduce((sum, investment) => {
      return sum + (investment.currentReturn || 0);
    }, 0);

    next();
  });

  schema.methods.calculateProfit = function (
    investment: IActiveInvestment
  ): number {
    if (!investment.lastReturnUpdate || investment.status !== "active") {
      return 0;
    }

    const now = new Date();
    const daysSinceLastUpdate = Math.floor(
      (now.getTime() - investment.lastReturnUpdate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Return current profit if no days have passed
    if (daysSinceLastUpdate <= 0) {
      return investment.currentReturn || 0;
    }

    // Calculate new profit
    const newProfit = investment.dailyReturn * daysSinceLastUpdate;
    return Number((investment.currentReturn || 0) + newProfit);
  };

  schema
    .virtual("totalActiveInvestments")
    .get(function (this: IInvestmentInformation) {
      return this.activeInvestments.reduce(
        (sum, investment) =>
          sum + (investment.status === "active" ? investment.amount : 0),
        0
      );
    });

  schema
    .virtual("totalCurrentReturns")
    .get(function (this: IInvestmentInformation) {
      return this.activeInvestments.reduce(
        (sum, investment) =>
          sum + (investment.status === "active" ? investment.currentReturn : 0),
        0
      );
    });

  schema.methods.updateReturns = async function (this: IInvestmentInformation) {
    const now = new Date();

    this.activeInvestments = this.activeInvestments.map(
      (investment: IActiveInvestment) => {
        if (investment.status === "active") {
          // Calculate new return using the calculateProfit method
          const newReturn = this.calculateProfit(investment);

          // Only update if there's a change
          if (newReturn !== investment.currentReturn) {
            investment.currentReturn = newReturn;
            investment.lastReturnUpdate = now;
          }
        }
        return investment;
      }
    );

    // Update total returns earned
    this.totalReturnsEarned = this.activeInvestments.reduce(
      (sum, investment) => sum + (investment.currentReturn || 0),
      0
    );

    await this.save();
    return this;
  };

  return schema;
};

const InvestmentInformation: Model<IInvestmentInformation> =
  mongoose.models.InvestmentInformation ||
  mongoose.model<IInvestmentInformation>(
    "InvestmentInformation",
    createSchema()
  );

export default InvestmentInformation;
