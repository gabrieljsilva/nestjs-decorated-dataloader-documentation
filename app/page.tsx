import { CodeBlock } from "@/components/code-block";

export default function Page() {
	return (
		<>
			<div className="flex flex-1 flex-col gap-8 p-4 sm:px-6 md:px-8 lg:px-12 w-full">
				<div className="space-y-8">
					<section id="graphql" className="space-y-4">
						<h2 className="text-3xl font-bold">GraphQL</h2>
						<p>
							GraphQL is a query language for APIs that lets clients ask for
							exact data they need, avoiding unnecessary information. Unlike
							traditional REST APIs (which require multiple endpoints for
							different resources), GraphQL uses a single endpoint with flexible
							queries. However, because each field in a query is handled by
							separate functions (resolvers), it can lead to the N+1 problem:
							fetching related data (like posts and their authors) might trigger
							separate database calls for each item, causing inefficiency. To
							fix this, developers use strategies and tools to optimize data
							fetching, even for complex nested queries.
						</p>
					</section>

					<section id="dataloaders" className="space-y-4">
						<h2 className="text-3xl font-bold">Dataloaders</h2>
						<p>
							dataloaders solve performance issues in GraphQL, especially the
							N+1 problem. They work by batching (grouping) and caching
							requests. For example: if multiple resolvers ask for user data
							(like post authors), the dataloader collects all required IDs in
							one processing cycle and makes a single database query instead of
							one per ID. It also caches results to avoid repeats. This reduces
							the number of requests and speeds up the API, making dataloaders
							essential for scalable GraphQL apps.
						</p>
					</section>

					<section id="nestjs" className="space-y-4">
						<h2 className="text-3xl font-bold">NestJS</h2>
						<p>
							NestJS is a Node.js framework for building organized, scalable
							apps. It has built-in GraphQL support, letting developers define
							schemas, resolvers, and use dependency injection for clean code
							structure. To optimize queries, developers often use dataloaders
							in resolvers. However, a common challenge is needing to create a
							separate dataloader for every data relationship (e.g., one for
							users, another for posts). This leads to repetitive code and
							complexity in large projects. Despite this, NestJS's modular
							architecture and powerful tools make it a top choice for building
							complex, high-performance APIs.
						</p>
					</section>

					<section id="installation" className="space-y-4">
						<h2 className="text-3xl font-bold">Installation</h2>
						{/*<InstallationCode packageName="nestjs-decorated-dataloaders" />*/}
					</section>

					<section id="quick-start" className="space-y-4">
						<h2 className="text-3xl font-bold">Quick Start</h2>

						<div className="space-y-4">
							<h3 className="text-2xl font-semibold">Module Configuration</h3>
							<p>
								Configure the <code>DataloaderModule</code> in your application
								module:
							</p>
							<CodeBlock
								filename="app.module.ts"
								code={`import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { LRUMap } from "lru_map";
import { DataloaderModule } from "nestjs-decorated-dataloaders";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    DataloaderModule.forRoot({
      cache: true,
      maxBatchSize: 100,
      getCacheMap: () => new LRUMap(100),
      name: "MyAwesomeDataloader",
    }),
  ],
})
export class AppModule {}`}
							/>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									<strong>cache</strong>: Enables caching.
								</li>
								<li>
									<strong>maxBatchSize</strong>: Limits the maximum number of
									batched requests.
								</li>
								<li>
									<strong>getCacheMap</strong>: Defines a custom cache
									implementation (e.g., LRU Cache).
								</li>
								<li>
									<strong>name</strong>: Names the dataloader for better
									tracking and debugging.
								</li>
							</ul>
						</div>
					</section>

					<section id="defining-entities" className="space-y-4">
						<h2 className="text-3xl font-bold">Defining Entities</h2>

						<div className="space-y-4">
							<h3 className="text-2xl font-semibold">PhotoEntity</h3>
							<CodeBlock
								filename="photo.entity.ts"
								code={`export class PhotoEntity {
  id: number;
  url: string;
  userId: number;
}`}
							/>
						</div>

						<div className="space-y-4">
							<h3 className="text-2xl font-semibold">UserEntity</h3>
							<CodeBlock
								filename="user.entity.ts"
								code={`import { Load } from "nestjs-decorated-dataloaders";
import { PhotoEntity } from "./photo.entity";

export class UserEntity {
  id: number;
  name: string;

  @Load(() => PhotoEntity, { key: "id", parentKey: "userId", handler: "LOAD_PHOTOS_BY_USER_ID" })
  photo: PhotoEntity;

  @Load(() => [PhotoEntity], { key: "id", parentKey: "userId", handler: "LOAD_PHOTOS_BY_USER_ID" })
  photos: PhotoEntity[];
}`}
							/>
						</div>
					</section>

					<section id="dataloader-handlers" className="space-y-4">
						<h2 className="text-3xl font-bold">Dataloader Handlers</h2>
						<p>
							Dataloader handlers define how data is fetched from the data
							source. Handlers are tied to specific dataloaders using the{" "}
							<code>@DataloaderHandler</code> decorator.
						</p>
						<CodeBlock
							filename="photo.service.ts"
							code={`import { DataloaderHandler } from "nestjs-decorated-dataloaders";
import { PhotoEntity } from "./photo.entity";

export class PhotoService {
  @DataloaderHandler("LOAD_PHOTOS_BY_USER_ID")
  async loadPhotosByUserIds(userIds: number[]): Promise<PhotoEntity[]> {
    // Replace with actual data fetching logic
  }
}`}
						/>
					</section>

					<section id="using-dataloaders" className="space-y-4">
						<h2 className="text-3xl font-bold">
							Using Dataloaders in Resolvers
						</h2>
						<p>
							Resolvers use the <code>DataloaderService</code> to load related
							entities, ensuring requests are batched and cached.
						</p>
						<CodeBlock
							filename="user.resolver.ts"
							code={`import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { DataloaderService } from "nestjs-decorated-dataloaders";
import { UserEntity } from "./user.entity";
import { PhotoEntity } from "./photo.entity";

@Resolver(UserEntity)
export class UserResolver {
  constructor(private readonly dataloaderService: DataloaderService) {}

  @ResolveField(() => PhotoEntity)
  async photo(@Parent() user: UserEntity) {
    return this.dataloaderService.load({ from: UserEntity, field: "photo", data: user });
  }

  @ResolveField(() => [PhotoEntity])
  async photos(@Parent() user: UserEntity) {
    return this.dataloaderService.load({ from: UserEntity, field: "photos", data: user });
  }
}`}
						/>
					</section>

					<section id="advanced-concepts" className="space-y-8">
						<h2 className="text-3xl font-bold">Advanced Concepts</h2>

						<div id="handling-circular-dependencies" className="space-y-4">
							<h3 className="text-2xl font-semibold">
								Handling Circular Dependencies
							</h3>
							<p>
								Circular dependencies between entities (e.g., User ↔ Photo) can
								cause metadata resolution errors when using reflect-metadata.
								For example:
							</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									reflect-metadata tries to read metadata from User, which
									references Photo.
								</li>
								<li>
									Photo in turn references User, but if User hasn't been fully
									initialized, its metadata resolves to undefined.
								</li>
							</ul>
							<p>
								This issue is common in environments using SWC. To resolve it,
								use the <code>Relation&lt;T&gt;</code> wrapper provided by
								nestjs-decorated-dataloaders.
							</p>

							<h4 className="text-xl font-semibold">
								Solution: Wrapping Circular References
							</h4>
							<p>
								Encapsulate circular properties with{" "}
								<code>Relation&lt;T&gt;</code>. This prevents reflect-metadata
								from attempting to resolve the circular dependency during type
								introspection.
							</p>
							<CodeBlock
								filename="entities.ts"
								code={`import { Relation } from 'nestjs-decorated-dataloaders';

class User {
  photo: Relation<Photo>;
}

class Photo {
  user: Relation<User>;
}`}
							/>

							<h4 className="text-xl font-semibold">How It Works</h4>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									<strong>Generic Type Erasure:</strong> reflect-metadata cannot
									infer generic types like <code>Relation&lt;Photo&gt;</code>,
									so it defaults the metadata to undefined, avoiding circular
									resolution errors.
								</li>
								<li>
									<strong>Explicit Type Declaration:</strong> You must manually
									specify the wrapped type (e.g.,{" "}
									<code>Relation&lt;Photo&gt;</code>) to retain type safety in
									your code.
								</li>
							</ul>

							<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4">
								<p className="font-bold">Important Notes</p>
								<ul className="list-disc pl-6 mt-2">
									<li>
										Use <code>Relation&lt;T&gt;</code> only for circular
										dependencies. For non-circular references, use direct types
										(e.g., <code>Photo</code> instead of{" "}
										<code>Relation&lt;Photo&gt;</code>).
									</li>
									<li>
										Ensure the generic type (e.g., <code>Photo</code> inside{" "}
										<code>Relation&lt;Photo&gt;</code>) is explicitly declared
										to avoid type inference issues.
									</li>
								</ul>
							</div>
						</div>

						<div id="aliases" className="space-y-4">
							<h3 className="text-2xl font-semibold">Aliases</h3>
							<p>
								Aliases allow you to link a dataloader handler to an abstract
								class, which is especially useful when working with more complex
								architectures that include abstract or shared classes.
							</p>

							<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4">
								<p className="font-bold">Why Use Aliases?</p>
								<p>
									Sometimes you may want to map a dataloader handler to an
									abstract class that doesn't allow decorators. Aliases provide
									a way to assign a handler to such cases.
								</p>
							</div>

							<h4 className="text-xl font-semibold">Using Aliases</h4>
							<CodeBlock
								filename="photo.service.ts"
								code={`@AliasFor(() => AbstractPhotoService)
export class ConcretePhotoService {}`}
							/>
							<p>
								This allows <code>PhotoService</code> to serve as the dataloader
								handler for <code>AbstractPhotoService</code>.
							</p>
						</div>

						<div id="under-the-hood" className="space-y-4">
							<h3 className="text-2xl font-semibold">Under the Hood</h3>
							<p>
								<code>nestjs-decorated-dataloaders</code> is built on top of the
								GraphQL Dataloader library. At its core, a dataloader is a
								mechanism for batching and caching database or API requests,
								reducing the number of round trips required to fetch related
								data.
							</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									<strong>Batching:</strong> Dataloader batches multiple
									requests for the same resource into a single query. This
									ensures that, rather than issuing one query per entity (e.g.,
									fetching one photo per user), the dataloader combines them
									into a single query that fetches all the photos for the users
									in one go.
								</li>
								<li>
									<strong>Caching:</strong> Dataloader caches query results,
									preventing redundant queries for the same data within the same
									request cycle. This ensures that once a resource is fetched,
									subsequent requests for the same resource will use the cached
									data.
								</li>
							</ul>
						</div>

						<div id="high-level-abstraction" className="space-y-4">
							<h3 className="text-2xl font-semibold">
								High-Level Nest.js Abstraction
							</h3>
							<p>
								<code>nestjs-decorated-dataloaders</code> abstracts the
								complexities of manually managing dataloaders and integrates
								seamlessly with Nest.js using decorators. It provides a
								declarative and maintainable approach to solving the N+1
								problem, allowing you to focus on building features without
								worrying about the underlying dataloader logic.
							</p>
							<p>
								By using decorators like <code>@Load</code> and{" "}
								<code>@DataloaderHandler</code>, this module streamlines
								dataloader setup, making it simple to handle related entities in
								GraphQL resolvers without manual dataloader instantiation or
								dependency injection.
							</p>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
