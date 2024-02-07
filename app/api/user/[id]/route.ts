import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

type PatchRequest = {
  name: string;
};

type PostRequest = {
  action: string;
};

export type UserGetResponse = {
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
};

const AUTH0_API_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL!;
const AUTH0_MANAGEMENT_API_TOKEN = process.env.AUTH0_MANAGEMENT_API_TOKEN!;

export const apiClient = axios.create({
  baseURL: AUTH0_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH0_MANAGEMENT_API_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

async function verifySessionAndUser(
  req: Request,
  userId: string
): Promise<boolean> {
  const session = await getSession();
  if (!session || session.user.sub !== userId) {
    return false;
  }
  return true;
}

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Retrieves user details by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     responses:
 *       '200':
 *         description: A user object containing user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGetResponse'
 *       '401':
 *         description: Unauthorized, session not verified or user ID does not match
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       '500':
 *         description: Internal Server Error, something went wrong during the process
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 * components:
 *   schemas:
 *     UserGetResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         picture:
 *           type: string
 *           description: URL to the user's picture.
 *         email_verified:
 *           type: boolean
 *           description: Flag indicating whether the user's email address has been verified.
 */
export async function GET(req: Request, { params }: Params) {
  const userId = params.id;
  if (!(await verifySessionAndUser(req, userId)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { data } = await apiClient.get<UserGetResponse>(
      `/api/v2/users/${userId}`
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Updates the name of a user by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchRequest'
 *     responses:
 *       '200':
 *         description: The user's name was successfully updated
 *       '400':
 *         description: Validation Error, name must be between 1 and 300 characters
 *         content:
 *           application/json:
 *             example:
 *               error: Name must be between 1 and 300 characters
 *       '401':
 *         description: Unauthorized, session not verified or user ID does not match
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       '500':
 *         description: Internal Server Error, something went wrong during the update process
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 * components:
 *   schemas:
 *     PatchRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The new name of the user.
 */
export async function PATCH(req: Request, { params }: Params) {
  const userId = params.id;

  if (!(await verifySessionAndUser(req, userId)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data: PatchRequest = await req.json();

    if (data.name.length <= 0 || data.name.length > 300) {
      return NextResponse.json(
        { error: "Name must be between 1 and 300 characters" },
        { status: 400 }
      );
    }
    await apiClient.patch(`/api/v2/users/${userId}`, { name: data.name });
    return NextResponse.json({ message: "Name updated successfully." });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/{id}:
 *   post:
 *     summary: Performs an action for the user by user ID, such as resending the verification email
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to perform the action for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostRequest'
 *     responses:
 *       '200':
 *         description: Action performed successfully, e.g., verification email sent
 *         content:
 *           application/json:
 *             example:
 *               message: Verification email sent successfully.
 *       '400':
 *         description: Invalid action provided
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid action provided
 *       '401':
 *         description: Unauthorized, session not verified or user ID does not match
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       '500':
 *         description: Internal Server Error, something went wrong during the action process
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 * components:
 *   schemas:
 *     PostRequest:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           description: The action to be performed for the user, e.g., "resendVerificationEmail".
 *       required:
 *         - action
 */
export async function POST(req: Request, { params }: Params) {
  const userId = params.id;

  if (!(await verifySessionAndUser(req, userId)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data: PostRequest = await req.json();

    if (data.action === "resendVerificationEmail") {
      await apiClient.post(`/api/v2/jobs/verification-email`, {
        user_id: userId,
      });
      return NextResponse.json({
        message: "Verification email sent successfully.",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
