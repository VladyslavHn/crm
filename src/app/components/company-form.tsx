'use client';

import React from 'react';
import {Field, Form, Formik} from 'formik';
import Button from '@/app/components/button';
import InputField from '@/app/components/input-field';
import LogoUploader from '@/app/components/logo-uploader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CompanyStatus,
    createCompany,
    getCategories,
    getCountries,
} from '@/lib/api';
import StatusLabel from '@/app/components/status-label';

export type CompanyFieldValues = {
    title: string;
    description: string;
    status: CompanyStatus;
    joinedDate: string;
    categoryId: string;
    countryId: string;
};

const initialValues: CompanyFieldValues = {
    title: '',
    description: '',
    status: CompanyStatus.Active,
    joinedDate: '',
    categoryId: '',
    countryId: '',
};

export interface CompanyFormProps {
    onSubmit?: (values: CompanyFieldValues) => void | Promise<void>;
}

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
    const queryClient = useQueryClient();

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 10 * 1000,
    });

    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        staleTime: 10 * 1000,
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['companies'],
            });
        },
    });

    const handleSubmit = async (values: CompanyFieldValues) => {
        await mutateAsync({
            ...values,
            categoryTitle:
                categories.find(({ id }) => id === values.categoryId)?.title ?? '',
            countryTitle:
                countries.find(({ id }) => id === values.countryId)?.title ?? '',
        });

        if (onSubmit) {
            onSubmit(values);
        }
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className="flex flex-col gap-10">
                <p className="mb-0.5 text-xl">Add new company</p>
                <div className="flex gap-6">
                    <div className="flex flex-col flex-1 gap-5">
                        <LogoUploader label="Logo" placeholder="Upload photo" />
                        {/* Manually rendering the select element for Status */}
                        <div>
                            <label htmlFor="status">Status</label>
                            <Field as="select" name="status">
                                {(Object.values(CompanyStatus) as CompanyStatus[]).map(
                                    (status) => (
                                        <option key={status} value={status}>
                                            <StatusLabel status={status} styled={false} />
                                        </option>
                                    )
                                )}
                            </Field>
                        </div>
                        {/* Manually rendering the select element for Country */}
                        <div>
                            <label htmlFor="countryId">Country</label>
                            <Field as="select" name="countryId">
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.title}
                                    </option>
                                ))}
                            </Field>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-5">
                        <InputField required label="Name" placeholder="Name" name="title" />
                        {/* Manually rendering the select element for Category */}
                        <div>
                            <label htmlFor="categoryId">Category</label>
                            <Field as="select" name="categoryId">
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <InputField
                            required
                            label="Joined date"
                            type="date"
                            name="joinedDate"
                        />
                        <InputField
                            required
                            label="Description"
                            placeholder="Description"
                            name="description"
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isPending}>
                    Add company
                </Button>
            </Form>
        </Formik>
    );
}
