
interface Transaction {
    id: number;
    ref: string | null;
    description: string;
    title: string;
    type: string;
    creditType: string;
    paid: string;
    amount: string;
    read: boolean;
    status: string;
    jobId: number | null;
    userId: string;
    walletId: number;
    createdAt: string;
    updatedAt: string;
}



interface Summary {
    [key: string]: number;
}
