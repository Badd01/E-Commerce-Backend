import { z } from "zod";

export const categoriesSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name cannot be empty" }),
});

export const categoriesIdSchema = z.object({
  id: z
    .number({
      required_error: "Category id is required",
      invalid_type_error: "Category id must be a number",
    })
    .int({ message: "Category id must be a integer" })
    .positive({ message: "Category id must be > 0" }),
});

export const tagsSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name cannot be empty" }),
  categoryId: z
    .number({
      required_error: "Category id is required",
      invalid_type_error: "Category id must be a number",
    })
    .int({ message: "Category id must be a integer" })
    .positive({ message: "Category id must be > 0" }),
});

export const tagsIdSchema = z.object({
  id: z
    .number({
      required_error: "Tag id is required",
      invalid_type_error: "Tag id must be a number",
    })
    .int({ message: "Tag id must be a integer" })
    .positive({ message: "Tag id must be > 0" }),
});

export const colorsSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name cannot be empty" }),
});
export const colorsIdSchema = z.object({
  id: z
    .number({
      required_error: "Color id is required",
      invalid_type_error: "Color id must be a number",
    })
    .int({ message: "Color id must be a integer" })
    .positive({ message: "Color id must be > 0" }),
});

export const yearsSchema = z.object({
  name: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .int({ message: "Year must be a integer" })
    .min(2020, { message: "Year must be >= 2020" }),
});

export const yearsIdSchema = z.object({
  id: z
    .number({
      required_error: "Year id is required",
      invalid_type_error: "Year id must be a number",
    })
    .int({ message: "Year id must be a integer" })
    .positive({ message: "Year id must be > 0" }),
});
